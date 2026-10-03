/* 안드로이드 UA: 기본 링크·시험 패널·#apptest 실패 처리·CloseWatcher 준비 상태 */
const puppeteer = require('puppeteer-core');
const UA = 'Mozilla/5.0 (Linux; Android 15; SM-S937N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36';
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setUserAgent(UA); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
  await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, 3000));
  console.log(JSON.stringify(await p.evaluate(() => window.__hist && __hist())));
  const r = await p.evaluate(() => ({
    links: [...document.querySelectorAll('#appsBox .appi')].filter(a => /렌즈|파파고|번역|Claude|Gemini|카카오T|타베로그|우버/.test(a.textContent)).map(a => a.querySelector('b').textContent + ' → ' + a.getAttribute('href').slice(0, 90)),
    tests: document.querySelectorAll('#appTest a').length
  }));
  r.links.forEach(x => console.log('  ' + x)); console.log('tests=' + r.tests);
  await p.goto('http://localhost:8765/#apptest=lens-A', { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, 3500));
  console.log(await p.evaluate(() => 'after fail: view=' + document.querySelector('.view:not([hidden])').id + ' toast=' + document.querySelector('#toast').textContent + ' testOpen=' + (document.querySelector('#appTest') || {}).open + ' hash=' + location.hash));
  await b.close();
})();
