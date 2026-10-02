/* TOKYO QUEST 오프라인 지원
   - 페이지(index.html): 인터넷이 되면 항상 새 버전, 안 되거나 4초 넘게 걸리면 저장해 둔 버전
   - 아이콘·글꼴·three.js: 한 번 받으면 저장해 두고 씀 (뒤에서 조용히 새로 받기)
   - 날씨·환율 API, 구글 지도: 가로채지 않음 (페이지가 따로 저장해 둬요) */
const V = 'tq-v3';
const CORE = ['./', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const PAGE = new URL('./', self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('tq-') && k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function pageFirst(){
  return caches.open(V).then(c => {
    const net = fetch(PAGE, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(PAGE, r.clone()); return r; });
    const late = new Promise(res => setTimeout(res, 4000)).then(() => c.match(PAGE));
    return Promise.race([net, late.then(r => r || net)]).catch(() => c.match(PAGE)).then(r => r || net);
  });
}
function keep(req){
  return caches.open(V).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; });
    if (hit){ net.catch(() => {}); return hit; }
    return net;
  }));
}
const KEEP_HOSTS = /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)$/;

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate' && u.origin === location.origin){ e.respondWith(pageFirst()); return; }
  if (u.origin === location.origin){ if (!u.pathname.endsWith('/sw.js')) e.respondWith(keep(r)); return; }
  if (KEEP_HOSTS.test(u.hostname)) e.respondWith(keep(r));
});
