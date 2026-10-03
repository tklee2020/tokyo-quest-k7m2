/* 크게 보기 카드(보여주는 일본어·택시 카드)가 화면 폭을 넘지 않는지 — 폭별로 가장 긴 문장을 띄워 봐요.
   card 오른쪽 끝이 innerWidth 를 넘으면 FAIL. 3D 스킨(테두리 없는 카드)도 같이 봐요. */
const widths = [[320, 640], [360, 780], [390, 844], [412, 915]];
const checkBig = label => `(() => {
  const c = document.querySelector('#taxi .taxi__card'), r = c.getBoundingClientRect();
  const over = Math.max(0, Math.round(r.right - innerWidth), Math.round(-r.left));
  const tall = Math.round(r.height - innerHeight);
  return '${label} w=' + innerWidth + ' card=' + Math.round(r.left) + '..' + Math.round(r.right) + ' over=' + over + (tall > 0 ? ' TALL+' + tall : '') + (over ? ' FAIL' : ' ok');
})()`;
const sc = [];
widths.forEach(([w, h]) => ['2d', '3d'].forEach(mode => sc.push({
  name: `big-${w}-${mode}`, now: '2026-10-03T11:30:00+09:00', w, h, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:mapmode': JSON.stringify(mode), 'tokyoquest:theme': '"light"', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 1500 },
    { eval: `(() => { const b = document.createElement('button'); b.dataset.phr = 'hng'; b.id = 'qaPh'; document.body.appendChild(b); b.click(); return 'opened'; })()` },
    { wait: 300, eval: checkBig('phrase-hng') },
    { shot: `big-${w}-${mode}-phrase.png` },
    { eval: `document.querySelector('#taxiClose').click()` },
    { eval: `(() => { const b = document.createElement('button'); b.dataset.phr = 'sick'; document.body.appendChild(b); b.click(); return 'opened'; })()` },
    { wait: 300, eval: checkBig('phrase-sick') },
    { eval: `document.querySelector('#taxiClose').click()` },
    { eval: `(() => { const b = document.createElement('button'); b.dataset.taxi = '1'; document.body.appendChild(b); b.click(); return 'opened'; })()` },
    { wait: 300, eval: checkBig('taxi-hotel') },
    { shot: `big-${w}-${mode}-taxi.png` },
    { eval: `document.querySelector('#taxiClose').click()` },
    { eval: `document.querySelector('#dock [data-view=guide]').click()` },
    { wait: 600, eval: `'guide overflow=' + (document.documentElement.scrollWidth - innerWidth)` },
    { shot: `big-${w}-${mode}-guide.png` }
  ]
})));
module.exports = { parallel: 2, scenarios: sc };
