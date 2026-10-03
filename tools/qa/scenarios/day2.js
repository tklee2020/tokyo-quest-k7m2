/* Day 2 시부야: 그 시각 상단 바·카드, 목록, 상세(⭐ 필수), 주점 시부야, 앱 바로가기 줄, 공략집 앱 목록 */
const probe = `(() => { const c = [...document.querySelectorAll('.qcard')]; const a = c.findIndex(x => x.classList.contains('is-active')); return 'ticker=' + document.querySelector('#ticker').innerText.replace(/\s+/g, ' ') + ' | card=' + (c[a] ? c[a].querySelector('h3').innerText : '-') + ' | n=' + c.length + ' | apps=' + document.querySelectorAll('#appsRow .app').length + ' | overflow=' + (document.documentElement.scrollWidth - innerWidth); })()`;
module.exports = { parallel: 1, scenarios: [['13:40', 360, 'b'], ['16:55', 412, 'a'], ['18:22', 390, 'a']].map(([t, w, me]) => ({
  name: `d2-${t}-${w}`, now: `2026-10-04T${t}:00+09:00`, w, h: w === 360 ? 780 : 900, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': JSON.stringify(me) },
  steps: [
    { wait: 3500, eval: probe }, { shot: `d2-${t}-${w}-map.png` },
    { eval: `document.querySelector('.qcard.is-active [data-open]').click(); 'open'` },
    { wait: 900, shot: `d2-${t}-${w}-sheet.png` },
    { eval: `document.querySelector('#sheet [data-close]').click(); document.querySelector('#listQ').click(); 'list'` },
    { wait: 700, shot: `d2-${t}-${w}-list.png`, full: true },
    { eval: `document.querySelector('#listQ').click(); document.querySelector('#dock [data-view=guide]').click(); [...document.querySelectorAll('#tipsList summary')].find(s => /앱 바로가기/.test(s.textContent)).click(); 'apps acc'` },
    { wait: 700, eval: `'appsBox=' + document.querySelectorAll('#appsBox .appi').length + ' hrefs=' + [...document.querySelectorAll('#appsBox .appi')].slice(0, 3).map(a => a.getAttribute('href').slice(0, 40)).join(' | ')` },
    { shot: `d2-${t}-${w}-apps.png`, full: true }
  ]
})) };
