/* Day 1 밤: 야시장 카드(⭐ 필수)·목록·상세가 잘 보이는지, 그 시각 상단 바 */
const probe = `(() => { const c = [...document.querySelectorAll('.qcard')]; const a = c.findIndex(x => x.classList.contains('is-active')); return 'ticker=' + document.querySelector('#ticker').innerText.replace(/\s+/g, ' ') + ' | card=' + (c[a] ? c[a].querySelector('h3').innerText : '-') + ' | must=' + document.querySelectorAll('.qcard__must').length + ' | overflow=' + (document.documentElement.scrollWidth - innerWidth); })()`;
module.exports = { parallel: 1, scenarios: [['20:40', 360], ['21:45', 412]].map(([t, w]) => ({
  name: `night-${t}-${w}`, now: `2026-10-03T${t}:00+09:00`, w, h: w === 360 ? 780 : 915, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3500, eval: probe }, { shot: `night-${t}-${w}-map.png` },
    { eval: `(() => { const k = [...document.querySelectorAll('.qcard')].findIndex(x => /야시장/.test(x.textContent)); document.querySelectorAll('.qcard')[k].querySelector('[data-open]').click(); return 'open ' + k; })()` },
    { wait: 900, shot: `night-${t}-${w}-sheet.png` },
    { eval: `document.querySelector('#sheet [data-close]').click(); document.querySelector('#listQ').click(); 'list'` },
    { wait: 700, shot: `night-${t}-${w}-list.png` },
    { eval: `document.querySelector('#listQ').click(); document.querySelector('#dock [data-view=bars]').click(); 'bars'` },
    { wait: 700, shot: `night-${t}-${w}-bars.png`, full: true }
  ]
})) };
