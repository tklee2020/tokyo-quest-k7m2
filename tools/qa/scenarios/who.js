/* 사용자 고르기: 처음 열면 고르기 창 → 고르면 그 사람 화면으로 다시 열림 → 가방엔 그 사람 아이만, 메모도 그 사람 문장
   세형: 한 번 누르면 "육아 당첨" 놀림 → "구경만 할게요"를 누르면 관전 모드(둘 다 보여요) */
const pickThen = (w, id) => ({
  name: `who-${w}-${id}`, now: '2026-10-03T14:30:00+09:00', w, h: w === 360 ? 780 : 915, dpr: 2,
  ls: { 'tokyoquest:hello': 'true', 'tokyoquest:theme': '"light"' },
  steps: [
    { wait: 1800, eval: `'picker shown=' + !document.querySelector('#who').hidden + ' close hidden=' + document.querySelector('#whoX').hidden + ' 3d=' + document.documentElement.classList.contains('map3d')` },
    { shot: `who-${w}-first.png` },
    id === 's'
      ? { eval: `document.querySelector('.who__opt[data-me=s]').click(); 'tease=' + document.querySelector('#whoTease').textContent.slice(0, 40)` }
      : { eval: `setTimeout(() => document.querySelector('.who__opt[data-me=${id}]').click(), 50); 'clicking ${id}'` },
    ...(id === 's' ? [{ wait: 300, shot: `who-${w}-tease.png` }, { eval: `setTimeout(() => document.querySelector('#whoTease [data-me=s]').click(), 50); 'spectate'` }] : []),
    { wait: 3500, eval: `'after pick: me=' + localStorage.getItem('tokyoquest:me') + ' picker hidden=' + document.querySelector('#who').hidden + ' pill=' + document.querySelector('#mePill').textContent + ' spectate=' + !document.querySelector('#spectate').hidden` },
    { shot: `who-${w}-${id}-map.png` },
    { eval: `document.querySelector('#dock [data-view=bag]').click()` },
    { wait: 700, eval: `'kids=' + [...document.querySelectorAll('#kids .kid__name')].map(e => e.textContent).join('|') + ' tiles=' + document.querySelectorAll('#kidPanel .tile').length + ' bagPill=' + document.querySelector('#bagPill').textContent` },
    { shot: `who-${w}-${id}-bag.png`, full: true },
    { eval: `document.querySelector('#dock [data-view=map]').click()` },
    { wait: 600, eval: `(() => { const k = [...document.querySelectorAll('.qcard')].findIndex(x => /아카짱/.test(x.textContent)); if (k < 0) return 'no akachan card'; const b = document.querySelectorAll('.qcard')[k].querySelector('[data-open]'); (b || document.querySelectorAll('.qcard')[k]).click(); return 'opened ' + k; })()` },
    { wait: 900, eval: `(() => { const s = document.querySelector('#sheetBody .say'); return 'memo=' + (s ? s.textContent.slice(0, 90) : 'none'); })()` },
    { shot: `who-${w}-${id}-memo.png` },
    { eval: `document.querySelector('#sheet [data-close]').click()` },
    { wait: 500, eval: `document.querySelector('#dock [data-view=fx]').click()` },
    { wait: 600, eval: `'split who=' + [...document.querySelectorAll('.split__who button')].map(b => b.textContent + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join('|')` },
    { eval: `document.querySelector('#dock [data-view=map]').click(); setTimeout(() => document.querySelector('#mePill').click(), 50); 'open switch'` },
    { wait: 500, eval: `'switch open: close visible=' + !document.querySelector('#whoX').hidden + ' pressed=' + (document.querySelector('.who__opt[aria-pressed=true]') || {}).dataset.me` },
    { shot: `who-${w}-${id}-switch.png` },
    { eval: `(() => { const sel = getComputedStyle(document.querySelector('.qcard') || document.body).userSelect; const inp = getComputedStyle(document.querySelector('#fxRate')).userSelect; return 'userSelect card=' + sel + ' input=' + inp; })()` }
  ]
});
module.exports = { parallel: 1, scenarios: [pickThen(360, 'b'), pickThen(412, 'a'), pickThen(390, 's')] };
