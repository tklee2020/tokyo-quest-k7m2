/* 뒤로 가기 보호: 시트 닫기 → 지도로 → "한 번 더" 안내 → 2초 안에 한 번 더 → 나감 */
const st = "'hash=' + (location.hash || '-') + ' view=' + document.querySelector('.view:not([hidden])').id + ' sheet=' + !document.querySelector('#sheet').hidden + ' toast=' + (document.querySelector('#toast').classList.contains('is-on') ? document.querySelector('#toast').textContent : '-') + ' len=' + history.length";
module.exports = { parallel: 1, scenarios: [{
  name: 'back', now: '2026-10-03T14:30:00+09:00', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3000, tap: '#ticker' },
    { wait: 300, eval: `document.querySelector('#dock [data-view=bag]').click(); 'to bag'` },
    { wait: 400, eval: st },
    { eval: `history.back(); 'back1'` }, { wait: 500, eval: st },
    { tap: '.qcard.is-active [data-open]' }, { wait: 700, eval: st },
    { eval: `history.back(); 'back2 (close sheet)'` }, { wait: 600, eval: st },
    { eval: `history.back(); 'back3 (arm exit)'` }, { wait: 400, eval: st },
    { eval: `history.back(); 'back4 (exit)'` }, { wait: 1500, eval: `'after exit url=' + location.href` }
  ]
}] };
