const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await b.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', e => console.log('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(m.type() + ': ' + m.text().slice(0, 200)); });
  await page.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await page.evaluate(() => document.querySelector('#xmapBtn').click());
  for (let i = 0; i < 40; i++) { await sleep(1000); const l = await page.evaluate(() => window.__xm && __xm.loaded()); if (l) { console.log('loaded at', i + 1, 's'); break; } }
  console.log('after load zoom', await page.evaluate(() => __xm.getZoom().toFixed(2) + ' center ' + __xm.getCenter().toArray().map(v => v.toFixed(4))));
  await page.evaluate(() => document.querySelector('[data-xday="1"]').click());
  for (let i = 0; i < 8; i++) { await sleep(400); console.log('d2 t' + i, await page.evaluate(() => __xm.getZoom().toFixed(2) + ' moving=' + __xm.isMoving() + ' ' + __xm.getCenter().toArray().map(v => v.toFixed(4)))); }
  const r = await page.evaluate(() => { try { const c = __xm.cameraForBounds([[139.76, 35.67], [139.79, 35.71]], { padding: { top: 130, bottom: 70, left: 56, right: 120 }, maxZoom: 15.2 }); return JSON.stringify(c); } catch (e) { return 'ERR ' + e.message; } });
  console.log('cameraForBounds', r);
  await page.screenshot({ path: __dirname + '/out/xdebug2.png' });
  await b.close();
})();
