/* 3D 핀치 퍼즈: 두 손가락 줌·이동·한 손가락 떼기·다시 짚기를 무작위로 섞어서 카메라가 NaN/범위 밖으로 가는지 */
const puppeteer = require('puppeteer-core');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await b.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
  await page.goto('http://localhost:8765/?qa', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.n3[data-node]', { timeout: 40000 }); await sleep(2000);
  const res = await page.evaluate(async () => {
    const el = document.querySelector('#m3d'), c = el._ctl, r = el.getBoundingClientRect();
    const ev = (t, id, x, y) => el.dispatchEvent(new PointerEvent(t, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, isPrimary: id === 1 }));
    const wait = ms => new Promise(f => setTimeout(f, ms));
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const bad = [];
    const check = tag => { const v = [c.zoom, c.dist, c.t.x, c.t.y, c.t.z, c.gt.x, c.gt.z, c.az, c.pol]; if (v.some(n => !isFinite(n))) bad.push(tag + ' ' + JSON.stringify(v.map(n => +(+n).toFixed(1)))); };
    for (let round = 0; round < 40; round++){
      const cx = r.left + r.width * (0.3 + rnd() * 0.4), cy = r.top + r.height * (0.3 + rnd() * 0.4);
      let a = [cx - 40, cy], bb = [cx + 40, cy];
      ev('pointerdown', 1, a[0], a[1]);
      await wait(rnd() * 40);
      ev('pointerdown', 2, bb[0], bb[1]);
      const steps = 6 + Math.floor(rnd() * 12), zoomV = (rnd() - 0.5) * 30, panX = (rnd() - 0.5) * 40, panY = (rnd() - 0.5) * 40;
      for (let i = 0; i < steps; i++){
        a = [a[0] - zoomV / 2 + panX + (rnd() - 0.5) * 6, a[1] + panY + (rnd() - 0.5) * 6];
        bb = [bb[0] + zoomV / 2 + panX + (rnd() - 0.5) * 6, bb[1] + panY + (rnd() - 0.5) * 6];
        ev('pointermove', 1, a[0], a[1]); if (rnd() > 0.2) ev('pointermove', 2, bb[0], bb[1]);
        await wait(12); check('r' + round + 's' + i);
      }
      if (rnd() > 0.5){ ev('pointerup', 2, bb[0], bb[1]); for (let i = 0; i < 5; i++){ a = [a[0] + 9, a[1] + 4]; ev('pointermove', 1, a[0], a[1]); await wait(12); check('lift' + round); } if (rnd() > 0.5){ ev('pointerdown', 2, a[0] + 70, a[1]); for (let i = 0; i < 5; i++){ ev('pointermove', 1, a[0] - i * 6, a[1]); ev('pointermove', 2, a[0] + 70 + i * 6, a[1]); await wait(12); check('re' + round); } ev('pointerup', 2, a[0], a[1]); } }
      ev('pointerup', 1, a[0], a[1]); ev('pointerup', 2, bb[0], bb[1]);
      await wait(60); check('end' + round);
    }
    await wait(1500); check('settle');
    return { bad: bad.slice(0, 8), nBad: bad.length, final: { zoom: c.zoom, dist: c.dist, t: [c.t.x, c.t.y, c.t.z], gt: [c.gt.x, c.gt.z], pol: c.pol } };
  });
  console.log(JSON.stringify(res, null, 1));
  await page.screenshot({ path: __dirname + '/out/pinchfuzz.png' });
  await b.close();
})();
