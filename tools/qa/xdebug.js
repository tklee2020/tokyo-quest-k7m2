/* 실제 지도 디버그: 콘솔·네트워크 실패·지도 상태를 찍어요 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await b.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  page.on('console', m => console.log('console.' + m.type() + ': ' + m.text().slice(0, 300)));
  page.on('pageerror', e => console.log('pageerror: ' + e.message));
  page.on('requestfailed', r => console.log('reqfail: ' + r.url().slice(0, 120) + ' ' + (r.failure() && r.failure().errorText)));
  page.on('response', r => { if (/openfreemap|jsdelivr/.test(r.url()) && r.status() >= 300) console.log('resp ' + r.status() + ' ' + r.url().slice(0, 120)); });
  await page.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
  await page.goto(process.env.QA_URL || 'http://localhost:8765/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(() => document.querySelector('#xmapBtn').click());
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 2500));
    const st = await page.evaluate(() => {
      const m = window.__xm; if (!m) return 'no map yet gl=' + !!window.maplibregl;
      const c = document.querySelector('#xmapMap canvas');
      return `loaded=${m.loaded()} styleLoaded=${m.isStyleLoaded()} zoom=${m.getZoom().toFixed(2)} canvas=${c ? c.width + 'x' + c.height : '-'} mapdiv=${document.querySelector('#xmapMap').offsetWidth}x${document.querySelector('#xmapMap').offsetHeight} layers=${m.getStyle() ? m.getStyle().layers.length : 0} loadHidden=${document.querySelector('#xmapLoad').hidden} res=${performance.getEntriesByType('resource').filter(e => /openfreemap/.test(e.name)).length} tiles=${performance.getEntriesByType('resource').filter(e => /\.pbf/.test(e.name)).length} areTilesLoaded=${m.areTilesLoaded()}`;
    });
    console.log('t' + i + ': ' + st);
  }
  await page.screenshot({ path: __dirname + '/out/xdebug.png' });
  await b.close();
})();
