/* TRIP 데이터 정합성 — 브라우저 없이 index.html 의 const TRIP 만 읽어서 검사해요.
   사용: node data-check.js [../../index.html]
   잡는 것: 없는 장소·노드 참조, 시간 역전·겹침, 영업시간 밖 방문, 그날 휴무인 B루트, 요일 오기,
           영업시간(openHours)과 요일 플래그(open) 불일치, 좌표(geo)가 지역 중심에서 너무 먼 곳, 지도 노드와 GPS 투영 차이 */
const fs = require('fs');
const path = require('path');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'index.html'));
const html = fs.readFileSync(file, 'utf8').replace(/\r/g, '');
const m = html.match(/const TRIP = (\{[\s\S]*?\n\});\n<\/script>/);
if (!m) { console.error('const TRIP = {...}; 블록을 못 찾았어요'); process.exit(1); }
const TRIP = eval('(' + m[1] + ')');
const P = TRIP.places, N = TRIP.nodes, out = [];
const toMin = t => { const a = t.split(':').map(Number); return a[0] * 60 + a[1]; };
const durMin = s => { s = String(s || '').replace(/\{\?\}/g, ''); let v = 0; const h = /(\d+)\s*시간/.exec(s); if (h) v += +h[1] * 60; const x = /(\d+)(?:\s*~\s*(\d+))?\s*분/.exec(s); if (x) v += +(x[2] || x[1]); return v; };
const WD = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], WJ = ['日', '月', '火', '水', '木', '金', '土'];
const DK = TRIP.days.map(d => WD[new Date(d.date + 'T12:00:00Z').getUTCDay()]);
const hh = v => `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;

TRIP.days.forEach((d, i) => { const wd = new Date(d.date + 'T12:00:00Z').getUTCDay(); if (d.dow !== WJ[wd]) out.push(`요일 오기: ${d.date} 는 ${WJ[wd]} 인데 데이터는 ${d.dow}`); });
TRIP.days.forEach((day, di) => {
  let prevEnd = null;
  day.items.forEach((it, k) => {
    const tag = `D${di + 1} ${it.t}`;
    if (it.place && !P[it.place]) out.push(`${tag}: 없는 장소 ${it.place}`);
    if (it.alt && it.alt.place && !P[it.alt.place]) out.push(`${tag}: B루트 장소 없음 ${it.alt.place}`);
    if (!N[it.node]) out.push(`${tag}: 없는 지도 노드 ${it.node}`);
    if (!it.tags || !it.tags.length) out.push(`${tag}: tags 없음`);
    const s = toMin(it.t), e = it.end ? toMin(it.end) : null, nx = day.items[k + 1] ? toMin(day.items[k + 1].t) : null;
    if (nx != null && nx < s) out.push(`${tag}: 다음 일정이 더 이른 시각`);
    if (e != null && nx != null && e > nx) out.push(`${tag}: ${it.end} 에 끝나는데 다음 일정은 ${day.items[k + 1].t} 시작`);
    const legs = (it.move || []).filter(x => x.line !== 'air'), mins = legs.reduce((t, x) => t + durMin(x.dur), 0);
    if (legs.length && mins && !legs.some(x => x.line === 'keisei') && prevEnd != null){
      const leave = s - mins - 5;
      if (leave < prevEnd) out.push(`${tag} (참고): 이동 ${mins}분+여유 5분이면 ${hh(leave)} 출발인데 앞 일정은 ${hh(prevEnd)} — 페이지는 "끝나면 바로 이동"/"빠듯"으로 표시`);
    }
    prevEnd = e != null ? e : s;
    const oh = TRIP.openHours && TRIP.openHours[it.place];
    if (oh){
      const o = oh[DK[di]];
      if (o === 0) out.push(`${tag} ${it.place}: 그날 휴무 (openHours)`);
      else if (o && !o.some(r => { const [a, b] = r.split('-').map(toMin); const bb = b <= a ? b + 1440 : b; return s >= a && (e == null ? s < bb : e <= bb); })) out.push(`${tag} ${it.place}: ${it.t}${it.end ? '–' + it.end : ''} 이 영업시간 ${o.join(',')} 밖`);
    }
    const ao = it.alt && it.alt.place && TRIP.openHours && TRIP.openHours[it.alt.place];
    if (ao){ const o = ao[DK[di]]; if (o === 0) out.push(`${tag}: B루트 ${it.alt.place} 그날 휴무`); }
  });
});
Object.keys(TRIP.openHours || {}).forEach(id => { if (!P[id]) out.push('openHours 에 없는 장소 ' + id); });
Object.entries(P).forEach(([id, p]) => {
  if (!p.q) out.push(`장소 ${id}: 지도 검색어 q 없음`);
  if (p.open && TRIP.openHours && TRIP.openHours[id]) Object.keys(p.open).forEach(k => { const a = p.open[k], b = TRIP.openHours[id][k]; if ((a === 0) !== (b === 0)) out.push(`장소 ${id} ${k}: open=${a} 인데 openHours=${JSON.stringify(b)}`); });
  if (TRIP.geo && !TRIP.geo[id] && !TRIP.nodes[id]) out.push(`장소 ${id}: geo 좌표 없음 (주변·거리 계산에서 빠져요)`);
});
(TRIP.bars || []).forEach(b => { b.spots.concat(b.course.map(c => c.place)).forEach(s => { if (!P[s]) out.push(`주점 ${b.id}: 없는 장소 ${s}`); }); });
Object.values(TRIP.shops || {}).forEach(s => { if (s.place && !P[s.place]) out.push('매장 장소 없음 ' + s.place); });
const ids = {}; (TRIP.phrases || []).forEach(g => g.list.forEach(p => { if (ids[p.id]) out.push('중복 문구 id ' + p.id); ids[p.id] = 1; }));
const hav = (a, b) => { const R = 6371000, r = d => d * Math.PI / 180, dLa = r(b[0] - a[0]), dLo = r(b[1] - a[1]); const q = Math.sin(dLa / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(q)); };
Object.entries(TRIP.geo || {}).forEach(([id, g]) => { const a = TRIP.areas[g[0]]; if (!a) { out.push('geo 지역 없음 ' + g[0]); return; } const d = hav(a.ll, [g[1], g[2]]); if (d > 900) out.push(`geo ${id}: ${g[0]} 중심에서 ${Math.round(d)}m`); });
/* 지도 노드(360×460 그림 좌표)와 GPS 투영(proj) 비교 — 페이지의 LON0/LAT0/배율을 그대로 읽어요 */
const pm = html.match(/const LON0 = ([\d.]+), LAT0 = ([\d.]+);\s*\nconst proj = \(lat, lng\) => \(\{ x: ([\d.]+) \+ ([\d.]+) \* \(lng - LON0\), y: ([\d.]+) - ([\d.]+) \* \(lat - LAT0\) \}\);/);
if (pm){
  const [, LON0, LAT0, X0, KX, Y0, KY] = pm.map(Number);
  Object.entries(TRIP.areas).forEach(([k, a]) => { const n = N[k]; if (!n || n.sky) return; const x = X0 + KX * (a.ll[1] - LON0), y = Y0 - KY * (a.ll[0] - LAT0), d = Math.hypot(x - n.x, y - n.y); if (d > 25) out.push(`노드 ${k}: 그림 (${n.x},${n.y}) vs GPS 투영 (${x.toFixed(0)},${y.toFixed(0)}) — ${d.toFixed(0)}px 차이${n.label ? ' (화면 밖 노드면 정상)' : ''}`); });
}
console.log(out.length ? out.join('\n') : '문제 없음');
