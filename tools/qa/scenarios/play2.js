module.exports = { parallel: 1, scenarios: [{
  name: 'play2', now: '2026-10-03T05:00:00+09:00', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3500, eval: `document.querySelector('#playQ').click(); 'play ' + document.querySelector('#playQ').textContent` },
    ...[1,2,3,4,5,6,7,8,9,10].map(i => ({ wait: 1500, eval: `'t${i} ' + document.querySelector('#qcount').textContent + ' btn=' + document.querySelector('#playQ').textContent` }))
  ]
}] };
