/* 여행 중 실제로 화면을 볼 순간들 — 상단 바(NOW/NEXT·출발·막차·열차), 고른 카드, 체크리스트 바, 가로 넘침을 한 줄씩 찍어요.
   새 여행이면 times 를 그 일정의 "출발 전 새벽 · 도착 직후 · 쇼핑 중 · 술자리 · 자정 직전/직후 · 공항 열차 직전 · 기내 · 여행 다음 날"로 바꾸세요. */
const probe = `(() => {
  const q = s => document.querySelector(s);
  const cards = [...document.querySelectorAll('.qcard')];
  const act = cards.findIndex(c => c.classList.contains('is-active'));
  return {
    ticker: q('#ticker').innerText.replace(/\\s+/g, ' '),
    dday: q('#ddayPill').innerText,
    ch: [...document.querySelectorAll('.ch')].map(b => b.getAttribute('aria-selected') + (b.classList.contains('is-today') ? '*' : '')).join(','),
    card: (act + 1) + ' ' + (cards[act] ? cards[act].querySelector('h3').innerText : '-'),
    badges: cards.map(c => c.querySelector('.qcard__badge').textContent || '-').join(''),
    checkbar: q('#checkbar').hidden ? 'hidden' : q('#checkbar').innerText.replace(/\\s+/g, ' '),
    theme: document.documentElement.getAttribute('data-theme'),
    overflow: document.documentElement.scrollWidth - innerWidth
  };
})()`;
const times = [
  ['before-leaving', '2026-10-03T05:00:00+09:00'],
  ['landed',         '2026-10-03T10:50:00+09:00'],
  ['train-in-4min',  '2026-10-03T11:45:00+09:00'],
  ['lunch-leave',    '2026-10-03T13:12:00+09:00'],
  ['bar',            '2026-10-03T18:30:00+09:00'],
  ['bar-to-bar',     '2026-10-03T19:10:00+09:00'],
  ['before-midnight','2026-10-03T23:50:00+09:00'],
  ['after-midnight', '2026-10-04T00:30:00+09:00'],
  ['late-night',     '2026-10-04T01:30:00+09:00'],
  ['day2-morning',   '2026-10-04T09:30:00+09:00'],
  ['day2-handoff',   '2026-10-04T16:15:00+09:00'],
  ['day3-checkout',  '2026-10-05T06:10:00+09:00'],
  ['airport-train',  '2026-10-05T08:20:00+09:00'],
  ['in-the-air',     '2026-10-05T13:30:00+09:00'],
  ['after-trip',     '2026-10-06T10:00:00+09:00']
];
module.exports = { parallel: 1, scenarios: times.map(([n, now]) => ({
  name: n, now, w: 390, h: 844, ls: { 'tokyoquest:hello': 'true', 'tokyoquest:me': '"a"', 'tokyoquest:mapmode': '"2d"' },
  steps: [{ wait: 1500 }, { eval: probe }, { shot: 'moment-' + n + '.png' }]
})) };
