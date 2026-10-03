/* 백그라운드에서 GPU 메모리를 잃었을 때: 2D로 안 내려가고 화면 복귀 시 3D를 다시 짓는지 */
const st = `'map3d=' + document.documentElement.classList.contains('map3d') + ' canvas=' + document.querySelectorAll('#m3d canvas').length + ' load=' + !document.querySelector('#m3dLoad').hidden`;
module.exports = { parallel: 1, scenarios: [{
  name: 'ctxlost', now: '2026-10-03T14:30:00+09:00', w: 390, h: 844, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"' },
  steps: [
    { wait: 4000, eval: st },
    /* 1) 화면이 보이는 중에 잃음 → 곧바로 다시 지음 */
    { eval: `(() => { const c = document.querySelector('#m3d canvas'); const gl = c.getContext('webgl2'); gl.getExtension('WEBGL_lose_context').loseContext(); return 'lost (visible)'; })()` },
    { wait: 300, eval: st },
    { wait: 4000, eval: st },
    /* 2) 숨김 상태에서 잃음 → 숨김 동안은 안 짓고, 보이면 짓기 */
    { eval: `(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); const c = document.querySelector('#m3d canvas'); c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext(); return 'lost (hidden)'; })()` },
    { wait: 1500, eval: st },
    { eval: `(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); return 'visible again'; })()` },
    { wait: 4000, eval: st },
    { shot: 'ctxlost.png' }
  ]
}] };
