/* 정산 원화: 예전 엔 기록 + 엔 1건 + 원 1건 → 합계·정산(원 기준)·목록·공유 문구 */
module.exports = { parallel: 1, scenarios: [{
  name: 'splitkrw', w: 360, h: 780, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"', 'tokyoquest:fxRate': '950', 'tokyoquest:split': JSON.stringify([{ id: 1, y: 3000, w: 'a', m: '예전 기록', t: 1759460000000 }]) },
  steps: [
    { wait: 3000, eval: `document.querySelector('#dock [data-view=fx]').click(); 'fx'` },
    { wait: 600, eval: `'res0=' + document.querySelector('#splitRes').innerText.replace(/\s+/g, ' ')` },
    { eval: `(() => { const f = document.querySelector('#split'); f.querySelector('[data-who=b]').click(); const y = document.querySelector('#splitY'); y.value = '2,000'; y.dispatchEvent(new Event('input')); document.querySelector('#splitM').value = '라멘'; document.querySelector('#splitForm').requestSubmit(); return 'jpy b 2000'; })()` },
    { eval: `(() => { document.querySelector('[data-cur=KRW]').click(); document.querySelector('[data-who=b]').click(); const y = document.querySelector('#splitY'); y.value = '47500'; y.dispatchEvent(new Event('input')); const c = document.querySelector('#splitConv').textContent; document.querySelector('#splitM').value = '숙소 추가요금'; document.querySelector('#splitForm').requestSubmit(); return 'krw b 47500 conv=' + c; })()` },
    { wait: 400, eval: `'res=' + document.querySelector('#splitRes').innerText.replace(/\s+/g, ' ') + ' | list=' + [...document.querySelectorAll('#splitList li .y')].map(e => e.textContent).join(',')` },
    { eval: `(() => { const w = document.querySelector('#splitList .who'); if (!w) return 'no who'; const r = w.getBoundingClientRect(), cs = getComputedStyle(w); return 'who=' + w.outerHTML.slice(0, 120) + ' rect=' + Math.round(r.width) + 'x' + Math.round(r.height) + ' disp=' + cs.display + ' vis=' + cs.visibility + ' op=' + cs.opacity; })()` },
    { shot: 'splitkrw.png', full: true }
  ]
}] };
