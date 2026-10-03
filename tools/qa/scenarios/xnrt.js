module.exports = { parallel: 1, scenarios: [{
  name: 'xnrt', now: '2026-10-05T09:50:00+09:00', w: 390, h: 844, dpr: 2, geo: [35.7720, 140.3929],
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3000, eval: `document.querySelector('#xmapBtn').click(); 'open'` },
    { wait: 30000, eval: `'loaded=' + (window.__xm && __xm.loaded()) + ' pins=' + document.querySelectorAll('.xpin').length` },
    { shot: 'xnrt-1.png' },
    { eval: `document.querySelector('#xmapNrt').click(); 'nrt'` },
    { wait: 4000, eval: `'card=' + document.querySelector('#xmapCard').innerText.replace(/\s+/g, ' ').slice(0, 120) + ' zoom=' + __xm.getZoom().toFixed(1)` },
    { shot: 'xnrt-2.png' },
    { eval: `document.querySelector('#xmapMe').click(); 'me'` },
    { wait: 4000, eval: `'me=' + !!document.querySelector('.xme') + ' msg=' + (document.querySelector('#xmapMsg').hidden ? '-' : document.querySelector('#xmapMsg').textContent) + ' center=' + __xm.getCenter().toArray().map(v => v.toFixed(3))` }
  ]
}] };
