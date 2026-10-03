/* 실제 지도: 열기 → 타일·핀·한국어 이름표 → 확대 시 추천 장소 늘어남 → 핀 누르면 카드 → 날짜 바꾸기 → 내 위치(지원 지역 안/밖) → 뒤로 가기로 닫힘 */
const pins = `(() => { const all = [...document.querySelectorAll('.xpin')]; const on = all.filter(p => !p.classList.contains('is-off')); return 'pins=' + all.length + ' visible=' + on.length + ' labels=' + on.filter(p => p.classList.contains('is-lbl')).length + ' zoom=' + (window.__xm ? __xm.getZoom().toFixed(1) : '?'); })()`;
const sc = (name, w, h, geo, extra) => ({
  name, now: '2026-10-03T20:40:00+09:00', w, h, dpr: 2, geo,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"', 'tokyoquest:theme': '"light"' },
  steps: [
    { wait: 3000, eval: `document.querySelector('#xmapBtn').click(); 'open'` },
    { wait: 22000, eval: `'open=' + !document.querySelector('#xmap').hidden + ' load=' + document.querySelector('#xmapLoad').hidden + ' err=' + document.querySelector('#xmapErr').hidden + ' gl=' + !!window.maplibregl + ' canvas=' + !!document.querySelector('#xmapMap canvas')` },
    { eval: pins },
    { shot: `${name}-1-open.png` },
    ...(extra || [])
  ]
});
const zoomIn = [
  { eval: `__xm.jumpTo({ center: [139.7955, 35.7128], zoom: 15.6 }); 'zoom to asakusa'` },
  { wait: 2500, eval: pins },
  { shot: 'xm-2-zoom.png' },
  { eval: `(() => { const p = [...document.querySelectorAll('.xpin--plan:not(.is-off) .xpin__b')].find(b => /야시장/.test(b.getAttribute('aria-label'))) || document.querySelector('.xpin--plan:not(.is-off) .xpin__b'); p.click(); return 'tap ' + p.getAttribute('aria-label'); })()` },
  { wait: 1500, eval: `'card=' + document.querySelector('#xmapCard').innerText.replace(/\\s+/g, ' ').slice(0, 140)` },
  { shot: 'xm-3-card.png' },
  { eval: `document.querySelector('[data-xday="1"]').click(); 'day2'` },
  { wait: 2500, eval: pins },
  { shot: 'xm-4-day2.png' },
  { eval: `document.querySelector('[data-xf="food"]').click(); 'food'` },
  { wait: 1500, eval: pins },
  { shot: 'xm-5-food.png' },
  { eval: `document.querySelector('#xmap3d').click(); 'toggle 3d'` },
  { wait: 1500, eval: `'3d btn=' + document.querySelector('#xmap3d').textContent` },
  { eval: `document.querySelector('#xmapMe').click(); 'me'` },
  { wait: 3000, eval: `'me marker=' + !!document.querySelector('.xme') + ' msg=' + (document.querySelector('#xmapMsg').hidden ? '-' : document.querySelector('#xmapMsg').textContent)` },
  { shot: 'xm-6-me.png' },
  { eval: `history.back(); 'back'` },
  { wait: 1200, eval: `'after back: xmap hidden=' + document.querySelector('#xmap').hidden + ' view ok=' + !!document.querySelector('#v-map:not([hidden])')` }
];
module.exports = { parallel: 1, scenarios: [
  sc('xm', 390, 844, [35.7142, 139.7935], zoomIn),
  sc('xm-out', 360, 780, [35.7720, 140.3929], [
    { eval: `document.querySelector('#xmapMe').click(); 'me (narita)'` },
    { wait: 3000, eval: `'msg=' + (document.querySelector('#xmapMsg').hidden ? '-' : document.querySelector('#xmapMsg').textContent)` },
    { shot: 'xm-out-me.png' }
  ])
] };
