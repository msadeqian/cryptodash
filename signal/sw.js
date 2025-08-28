const cacheName = 'crypto-signals-v3.1';
const assets = [
    './',
    './index.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];
const JSON_URL = 'https://msadeqian.github.io/jd/sgtest.json';

self.addEventListener('install', e=>{
    e.waitUntil(caches.open(cacheName).then(cache=>cache.addAll(assets)));
});

self.addEventListener('fetch', e=>{
    if(e.request.url === JSON_URL){
        e.respondWith(
            fetch(e.request).then(res=>{
                const resClone = res.clone();
                caches.open(cacheName).then(cache=>cache.put(e.request,resClone));
                return res;
            }).catch(()=>caches.match(e.request))
        );
    } else {
        e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
    }
});

self.addEventListener("push", function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Push event data error:", e);
  }

  const options = {
    body: data.message || "Notification",
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "CryptoDash", options)
  );

  // اگر reload=true باشه بعد از کلیک ری‌لود کنه
  if (data.reload) {
    self.addEventListener("notificationclick", function(ev) {
      ev.notification.close();
      ev.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
          for (const client of windowClients) {
            client.navigate(client.url);
            client.focus();
          }
        })
      );
    });
  }
});
