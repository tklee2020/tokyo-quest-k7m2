/* 재생: 장면마다 애니메이션이 끝난 뒤 1초 쉬고 넘어가는지 (비행 장면은 길게) */
module.exports = { parallel: 1, scenarios: [{
  name: 'play', now: '2026-10-03T05:00:00+09:00', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 3500, eval: `(() => { window.__log = []; let last = document.querySelector('#qcount').textContent, t0 = performance.now(); new MutationObserver(() => { const v = document.querySelector('#qcount').textContent; if (v !== last){ __log.push(v + '@' + Math.round(performance.now() - t0)); last = v; } }).observe(document.querySelector('#qcount'), { childList: true, characterData: true, subtree: true }); document.querySelector('#playQ').click(); return 'play'; })()` },
    { wait: 26000, eval: `'changes=' + __log.join(' ')` },
    { eval: `document.querySelector('#playQ').click(); 'stop'` }
  ]
}] };
