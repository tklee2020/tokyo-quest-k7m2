/* Day 2 B안: 신바시 시간대 상단 바·카드·상세, 주점 신바시, 실제 지도 Day 2 경로 */
const probe = `(() => { const c = [...document.querySelectorAll('.qcard')]; const a = c.findIndex(x => x.classList.contains('is-active')); return 'ticker=' + document.querySelector('#ticker').innerText.replace(/\s+/g, ' ') + ' | card=' + (c[a] ? c[a].querySelector('h3').innerText : '-') + ' | n=' + c.length + ' | overflow=' + (document.documentElement.scrollWidth - innerWidth); })()`;
module.exports = { parallel: 1, scenarios: [
  ...[['17:38', 390], ['18:20', 360], ['19:20', 412]].map(([t, w]) => ({
    name: `d2b-${t}-${w}`, now: `2026-10-04T${t}:00+09:00`, w, h: 860, dpr: 2,
    ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"b"' },
    steps: [
      { wait: 3500, eval: probe }, { shot: `d2b-${t}-${w}-map.png` },
      { eval: `document.querySelector('.qcard.is-active [data-open]').click(); 'open'` },
      { wait: 1200, eval: `'sheet=' + document.querySelector('#sheetBody').innerText.replace(/\s+/g, ' ').slice(0, 160)` },
      { shot: `d2b-${t}-${w}-sheet.png` }
    ]
  })),
  { name: 'd2b-bars', now: '2026-10-04T18:20:00+09:00', w: 390, h: 860, dpr: 2, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
    steps: [ { wait: 3000, eval: `document.querySelector('#dock [data-view=bars]').click(); document.querySelector('[data-area=shinbashi], #areafilter [data-a=shinbashi]') ? 'chip' : 'nochip'` },
             { wait: 800, eval: `'areas=' + [...document.querySelectorAll('#areafilter button')].map(b => b.textContent.trim()).join('|')` },
             { shot: 'd2b-bars.png', full: true } ] },
  { name: 'd2b-xmap', now: '2026-10-04T18:20:00+09:00', w: 390, h: 860, dpr: 2, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
    steps: [ { wait: 3000, eval: `document.querySelector('#xmapBtn').click(); 'open'` },
             { wait: 30000, eval: `'pins=' + document.querySelectorAll('.xpin').length + ' plan=' + [...document.querySelectorAll('.xpin--plan .xpin__t')].map(e => e.textContent.slice(0, 12)).join('|')` },
             { shot: 'd2b-xmap.png' } ] }
] };
