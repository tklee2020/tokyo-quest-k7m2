/* 뒤로 가기: 시트·실제 지도·택시 카드가 열려 있으면 그것부터 닫고, 그다음 "한 번 더" 안내 */
const st = "'view=' + document.querySelector('.view:not([hidden])').id + ' sheet=' + !document.querySelector('#sheet').hidden + ' xmap=' + !document.querySelector('#xmap').hidden + ' taxi=' + !document.querySelector('#taxi').hidden + ' toast=' + (document.querySelector('#toast').classList.contains('is-on') ? document.querySelector('#toast').textContent : '-') + ' len=' + history.length + ' ' + JSON.stringify(window.__hist ? __hist() : {})";
module.exports = { parallel: 1, scenarios: [{
  name: 'back2', now: '2026-10-03T14:30:00+09:00', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3000, tap: '#ticker' },
    { wait: 400, tap: '#nearBtn' }, { wait: 700, eval: st },
    { eval: `history.back(); 'back (close sheet)'` }, { wait: 600, eval: st },
    { tap: '#xmapBtn' }, { wait: 1500, eval: st },
    { eval: `history.back(); 'back (close xmap)'` }, { wait: 600, eval: st },
    { eval: `history.back(); 'back (toast)'` }, { wait: 300, eval: st },
    { wait: 2600, eval: `history.back(); 'back after 2.6s (toast again, not exit)'` }, { wait: 300, eval: st }
  ]
}] };
