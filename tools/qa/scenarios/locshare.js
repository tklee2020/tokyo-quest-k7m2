/* 서로 위치 보기: 두 폰(태균=아사쿠사, 현재=우에노)이 같은 테스트 코드로 동시에 켜고 → 서로의 칩이 뜨는지.
   실제 ntfy.sh로 암호화된 테스트 좌표를 보내요 (코드는 실행마다 새로). parallel 2 로 동시에. */
const CODE = 'QA' + Math.random().toString(36).slice(2, 10).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
const mk = (me, geo, w) => ({
  name: `ls-${me}`, w, h: 800, dpr: 2, geo,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': JSON.stringify(me), 'tokyoquest:lsCode': JSON.stringify(CODE), 'tokyoquest:lsOn': 'true' },
  steps: [
    { wait: 30000, eval: `'chip=' + (document.querySelector('#peerChip').hidden ? 'hidden' : document.querySelector('#peerChip').innerText.replace(/\\s+/g, ' '))` },
    { shot: `ls-${me}-map.png` },
    { eval: `document.querySelector('[data-ls-open]').click(); 'open panel'` },
    { wait: 800, eval: `'panel=' + document.querySelector('#sheetBody').innerText.replace(/\\s+/g, ' ').slice(0, 200)` },
    { shot: `ls-${me}-panel.png` }
  ]
});
module.exports = { parallel: 2, scenarios: [mk('a', [35.7142, 139.7935], 390), mk('b', [35.7100, 139.7745], 360)] };
