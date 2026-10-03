/* 안드로이드·아이폰 UA로 앱 바로가기 주소가 맞게 바뀌는지 */
const puppeteer = require('puppeteer-core');
const UAS = {
  android: 'Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36',
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
};
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  for (const [k, ua] of Object.entries(UAS)) {
    const p = await b.newPage(); await p.setUserAgent(ua); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await p.evaluateOnNewDocument(() => { localStorage.setItem('tokyoquest:hello', 'true'); localStorage.setItem('tokyoquest:me', '"a"'); });
    await p.goto('http://localhost:8765/', { waitUntil: 'domcontentloaded' }); await new Promise(r => setTimeout(r, 2500));
    const r = await p.evaluate(() => [...document.querySelectorAll('#appsBox .appi')].map(a => a.querySelector('b').textContent + ' → ' + a.getAttribute('href').slice(0, 95) + (a.dataset.scheme ? '  [scheme ' + a.dataset.scheme + ']' : '') + (a.target ? '' : '  (same tab)')));
    console.log('== ' + k); r.forEach(x => console.log('  ' + x));
    await p.close();
  }
  await b.close();
})();
