/* 3D 지도 터치 조작 — 핀치 확대·축소(양 끝 데드존 없음), 두 손가락 이동, 손가락 하나 먼저 떼기, 기본 보기 복귀, 페이지 확대 안 됨.
   카메라 상태는 페이지를 ?qa 로 열었을 때만 노출돼요 (#m3d._ctl).
   CDP 멀티터치는 "손가락 하나만 떼기"를 전달하지 못해서, 그 시험은 페이지 안에서 PointerEvent 를 직접 보내요. */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const URL0 = (process.env.QA_URL || 'http://localhost:8765/').replace(/\?.*$/, '') + '?qa';
const CHROME = process.env.CHROME || ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await b.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:mapmode', '"3d"'); localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
  await page.goto(URL0, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.n3[data-node]', { timeout: 40000 }); await sleep(2500);
  const box = await page.evaluate(() => { const r = document.querySelector('#m3d').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const cdp = await page.createCDPSession();
  const T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p[0], y: p[1], id: i })) });
  const state = () => page.evaluate(() => { const c = document.querySelector('#m3d')._ctl; return { zoom: +c.zoom.toFixed(3), dist: Math.round(c.dist), gaz: +c.gaz.toFixed(2), gpol: +c.gpol.toFixed(2), free: c.free, pageScale: visualViewport.scale, resetBtn: document.querySelector('#follow3d').classList.contains('is-off') ? 'gold' : 'plain' }; });
  async function pinch(d0, d1){
    await T('touchStart', [[cx - d0 / 2, cy], [cx + d0 / 2, cy]]);
    for (let i = 1; i <= 12; i++){ const d = d0 + (d1 - d0) * i / 12; await T('touchMove', [[cx - d / 2, cy], [cx + d / 2, cy]]); await sleep(16); }
    await T('touchEnd', []); await sleep(700);
  }
  const log = (k, v) => console.log(k.padEnd(28), JSON.stringify(v));
  log('start', await state());
  await pinch(80, 220); log('pinch out (zoom in)', await state());
  await pinch(80, 260); await pinch(80, 260); log('at max zoom', await state());
  await pinch(220, 170); log('pinch in a bit → must react', await state());
  for (let i = 0; i < 4; i++) await pinch(260, 60); log('at min zoom', await state());
  await pinch(170, 220); log('pinch out a bit → must react', await state());
  await T('touchStart', [[cx - 60, cy], [cx + 60, cy]]);
  for (let i = 1; i <= 10; i++){ await T('touchMove', [[cx - 60 + i * 8, cy + i * 3], [cx + 60 + i * 8, cy + i * 3]]); await sleep(16); }
  await T('touchEnd', []); await sleep(700);
  log('two-finger drag → pan only', await state());
  const lift = await page.evaluate(async () => {
    const el = document.querySelector('#m3d'), c = el._ctl, r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const ev = (t, id, px, py) => el.dispatchEvent(new PointerEvent(t, { pointerId: id, pointerType: 'touch', clientX: px, clientY: py, bubbles: true }));
    const wait = ms => new Promise(f => setTimeout(f, ms)), before = { zoom: c.zoom, gaz: c.gaz };
    ev('pointerdown', 11, x - 50, y); ev('pointerdown', 12, x + 50, y);
    for (let i = 1; i <= 8; i++){ ev('pointermove', 11, x - 50 - i * 5, y); ev('pointermove', 12, x + 50 + i * 5, y); await wait(16); }
    const pinched = { zoom: c.zoom, gaz: c.gaz };
    ev('pointerup', 12, x + 90, y);
    for (let i = 1; i <= 10; i++){ ev('pointermove', 11, x - 90 + i * 15, y + i * 6); await wait(16); }
    const after = { zoom: c.zoom, gaz: c.gaz };
    ev('pointerup', 11, x + 60, y + 60);
    return { before, pinched, afterLiftedFingerDrag: after, rotatedWhileOneFingerLeft: Math.abs(after.gaz - pinched.gaz) > 0.01 };
  });
  log('lift one finger mid-pinch', lift);
  await page.click('#follow3d'); await sleep(2200);
  log('reset button', await state());
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no console errors');
  await b.close();
})();
