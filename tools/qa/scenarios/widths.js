/* 폭 × 테마 × 화면(지도·가방·주점·공략집·환전) 전수 — 가로 넘침(scrollWidth > innerWidth)과 렌더를 봐요.
   overflow 가 0 이 아니면 그 화면 스크린샷부터 열어 보세요. */
const views = ['map', 'bag', 'bars', 'guide', 'fx'];
const sizes = [[360, 780, 3], [390, 844, 3], [430, 932, 3], [768, 1024, 2], [1280, 860, 1]];
const themes = ['light', 'dark'];
const sc = [];
sizes.forEach(([w, h, dpr]) => themes.forEach(t => sc.push({
  name: `${w}-${t}`, now: '2026-10-03T18:30:00+09:00', w, h, dpr,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"', 'tokyoquest:theme': JSON.stringify(t), 'tokyoquest:mapmode': '"2d"' },
  steps: [{ wait: 1200 }].concat(...views.map(v => [
    { eval: `document.querySelector('#dock [data-view=${v}]').click()` },   /* [data-view=…] 만 쓰면 <section>이 먼저 잡혀요 */
    { wait: 500, eval: `'${v} overflow=' + (document.documentElement.scrollWidth - innerWidth)` },
    { shot: `w${w}-${t}-${v}.png`, full: true }
  ]))
})));
module.exports = { parallel: 2, scenarios: sc };
