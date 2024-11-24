const base = location.protocol + "//" + location.host;//récupère l'url relative pour les éléments en cache
const PREFIX = "V7";//Numero de version
const CACHED_FILES = [`${base}Icons/Icon-No-Network.png`];
console.log("LANCEMENT SERVICE WORKER");

console.log(CACHED_FILES);

self.addEventListener('install',(event)=>{
  self.skipWaiting();//permet le remplacement du service worker dès que le nouveau existe
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PREFIX);

      await Promise.all(
        [...CACHED_FILES,'offline.html'].map((path)=>{
          return cache.add(new Request(path));
        })
      );
    })()
  );
  console.log(`Service worker :  ${PREFIX} Install`);
});


self.addEventListener('activate', (event) => {
  clients.claim();// Permet de controler tout de suite la page

  // Suppression des anciennes clé de caches
  event.waitUntil(
    (async()=>{
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) =>{
          if (!key.includes(PREFIX)) {
            return caches.delete(key);
          }
        })
      );
    })()
  );


  console.log(`Service worker : ${PREFIX} Active`);
});




self.addEventListener('fetch', (event) => {
  // console.log(`Service worker mode : ${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
  if (event.request.mode === 'navigate'){
    event.respondWith(
      (async () => {

        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse){
            return preloadResponse;
          }
  
          return await fetch(event.request);
        } catch (e) {
          const cache = await caches.open(PREFIX);
          return await cache.match('offline.html');
        }
      })()
    );
  } else if (CACHED_FILES.includes(event.request.url)){
    event.respondWith(caches.match(event.request));
  }
});