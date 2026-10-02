/* 실시간 위치 — 지하에서 잠깐 못 잡는 오류(code 2·3)에도 꺼지지 않는지, 위치가 잡히면 아바타·안내칩이 맞는지.
   watchPosition 을 가로채서 오류/위치를 원하는 순서로 넣어요. */
const stub = `(() => { const g = navigator.geolocation; g.watchPosition = (ok, err) => { window.__ok = ok; window.__err = err; return 7; }; g.clearWatch = () => {}; return 'stubbed'; })()`;
const st = `({ live: document.documentElement.classList.contains('is-live'), btn: (document.querySelector('[data-live]') || {}).textContent,
  ticker: document.querySelector('#ticker').innerText.replace(/\\s+/g, ' '), chip: document.querySelector('#guideChip').hidden ? '-' : document.querySelector('#guideChip').textContent,
  overflow: document.documentElement.scrollWidth - innerWidth })`;
module.exports = { scenarios: [
  { name: 'gps-asakusa-360', now: '2026-10-03T19:10:00+09:00', w: 360, h: 780, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:mapmode': '"2d"' }, steps: [
    { wait: 1200, eval: stub },
    { eval: "document.querySelector('#nearBtn').click()", wait: 500 },
    { eval: "document.querySelector('[data-live]').click()", wait: 300 },
    { eval: "window.__err({ code: 2 })", wait: 200 }, { eval: st },                         /* 첫 위치 전 일시 오류: 계속 기다려야 함 */
    { eval: "window.__ok({ coords: { latitude: 35.7110, longitude: 139.7960, accuracy: 20 } })", wait: 900 }, { eval: st },
    { eval: "window.__err({ code: 3 }); window.__err({ code: 2 })", wait: 300 }, { eval: st }, /* 켜진 뒤 일시 오류: 꺼지면 안 됨 */
    { eval: "document.querySelector('.sheet [data-close]').click()", wait: 700, shot: 'gps-asakusa-360.png' }
  ] },
  { name: 'gps-incheon', now: '2026-10-03T06:30:00+09:00', w: 390, h: 844, ls: { 'tokyoquest:hello': 'true' }, steps: [
    { wait: 1200, eval: stub },
    { eval: "document.querySelector('#nearBtn').click(); document.querySelector('[data-live]').click()", wait: 300 },
    { eval: "window.__ok({ coords: { latitude: 37.4602, longitude: 126.4407, accuracy: 30 } })", wait: 900 },
    { eval: "document.querySelector('.sheet [data-close]').click(); document.querySelectorAll('.qcard [data-open]')[0] && 'ok'", wait: 700 },
    { eval: "document.querySelector('#sky').classList.contains('is-on') ? 'sky scene ON (ok)' : 'sky scene OFF (bug)'", shot: 'gps-incheon.png' }
  ] }
] };
