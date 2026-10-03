module.exports = { parallel: 1, scenarios: [{ name: 'build', w: 390, h: 844, dpr: 2, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"', 'tokyoquest:build': '"old"' },
  steps: [ { wait: 3500, eval: `'toast=' + document.querySelector('#toast').textContent + ' | foot=' + [...document.querySelectorAll('#foot p')].map(p => p.textContent).filter(t => /버전/.test(t)).join('')` } ] }] };
