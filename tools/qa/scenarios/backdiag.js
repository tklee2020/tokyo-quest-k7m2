module.exports = { parallel: 1, scenarios: [{ name: 'diag', w: 390, h: 844, dpr: 2, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [ { wait: 3000, eval: `document.querySelector('#dock [data-view=guide]').click(); 'guide'` }, { wait: 500, eval: `document.querySelector('#backDiag').textContent` } ] }] };
