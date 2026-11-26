/* 주짓수 홈 트레이닝 — service worker
   앱을 수정해서 배포할 때마다 아래 VERSION 숫자를 하나 올려줘.
   그래야 태블릿에서 "새 버전이 있어" 안내가 뜨고 새 파일로 바뀌어. */
const VERSION = 'v2';
const APP_CACHE = 'jj-app-' + VERSION;
const FONT_CACHE = 'jj-fonts';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('jj-app-') && k !== APP_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: 캐시 먼저 보여주고 뒤에서 갱신 (오프라인에서도 글꼴 유지)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(async cache => {
        const hit = await cache.match(req);
        const net = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // 앱 파일: 캐시에서 바로 열고(빠르고 오프라인 OK), 새 버전은 VERSION 변경으로 받음
  event.respondWith(
    caches.open(APP_CACHE).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        if (req.mode === 'navigate') return cache.match('./index.html');
        throw e;
      }
    })
  );
});
