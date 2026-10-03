const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(); await p.setViewport({ width: 360, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); localStorage.setItem('tokyoquest:split', JSON.stringify([{ id: 1, y: 3000, w: 'a', m: '예전 기록', t: 1759460000000 }, { id: 2, cur: 'KRW', k: 47500, y: 0, w: 'b', m: '숙소', t: 1759460100000 }])); });
  await p.goto('http://localhost:8765/', { waitUntil: 'networkidle2' }); await new Promise(r => setTimeout(r, 2500));
  await p.evaluate(() => document.querySelector('#dock [data-view=fx]').click()); await new Promise(r => setTimeout(r, 800));
  const el = await p.$('#splitList'); await el.scrollIntoView(); await new Promise(r => setTimeout(r, 400));
  await el.screenshot({ path: __dirname + '/out/whoclip.png' });
  await b.close();
})();
