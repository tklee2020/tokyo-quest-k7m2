/* 배포본 연기 시험: 지금 시각(실제) 그대로 열어서 콘솔 오류 · 실제 지도 열림 · 서비스워커 등록 */
module.exports = { parallel: 1, scenarios: [{
  name: 'live', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 5000, eval: `'ticker=' + document.querySelector('#ticker').innerText.replace(/\s+/g, ' ') + ' | 3d=' + document.documentElement.classList.contains('map3d') + ' | apps=' + document.querySelectorAll('#appsRow .app').length + ' | sw=' + !!(navigator.serviceWorker && navigator.serviceWorker.controller)` },
    { shot: 'live-map.png' },
    { eval: `document.querySelector('#xmapBtn').click(); 'xmap'` },
    { wait: 20000, eval: `'xmap loaded=' + (window.__xm ? __xm.loaded() : 'no') + ' pins=' + document.querySelectorAll('.xpin').length + ' err=' + !document.querySelector('#xmapErr').hidden + ' load=' + !document.querySelector('#xmapLoad').hidden + ' ml=' + !!window.maplibregl` },
    { wait: 15000, eval: `'xmap+15s loaded=' + (window.__xm ? __xm.loaded() : 'no') + ' pins=' + document.querySelectorAll('.xpin').length` },
    { shot: 'live-xmap.png' }
  ]
}] };
