let pwa_cache_version = "MSS-cache-1.1.7";//version du dernier cache


self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(pwa_cache_version).then((cache) => {
        return cache.addAll([
          '/',
          'index.html',
          'manifest.json',
          'Icons/Icon-Accepter.png', 
          'Icons/Icon-Delete.png', 
          'Icons/Icon-Download.png', 
          'Icons/Icon-Favoris-Sel.png', 
          'Icons/Icon-Favoris.png', 
          'Icons/Icon-Info.png', 
          'Icons/Icon-New.png', 
          'Icons/Icon-Profil.png', 
          'Icons/Icon-Return-cancel.png', 
          'Icons/Icon-Setting.png', 
          'Icons/Icon-Upload.png', 
          'Icons/Icon-Valider.png', 
          'Icons/Logo_MSS-192.png', 
          'Icons/Logo_MSS-512.png', 
          'Icons/MSS-Logo.ico',
          'images/icon-art-martiaux.png', 
          'images/icon-autre-divers.png', 
          'images/icon-badminton.png', 
          'images/icon-baseball.png', 
          'images/icon-basketball.png', 
          'images/icon-boxe.png', 
          'images/icon-breakdance.png', 
          'images/icon-cap.png', 
          'images/icon-crossfit.png', 
          'images/icon-danse.png', 
          'images/icon-equitation.png', 
          'images/icon-escalade.png', 
          'images/icon-football.png', 
          'images/icon-golf.png', 
          'images/icon-handball.png', 
          'images/icon-intense-running.png', 
          'images/icon-marche.png', 
          'images/icon-musculation.png', 
          'images/icon-natation.png', 
          'images/icon-nautique.png', 
          'images/icon-patin.png', 
          'images/icon-rugby.png', 
          'images/icon-ski.png', 
          'images/icon-snowboard.png', 
          'images/icon-sport-co.png', 
          'images/icon-stretching.png', 
          'images/icon-tennis-de-table.png', 
          'images/icon-tennis.png', 
          'images/icon-triathlon.png', 
          'images/icon-velo.png', 
          'images/icon-volley.png', 
          'images/icon-yoga.png', 
          'scripts/activitySystem.js', 
          'scripts/app.js', 
          'scripts/favoris.js', 
          'scripts/importExport.js', 
          'scripts/info.js', 
          'scripts/notify.js', 
          'scripts/profil.js', 
          'scripts/setting.js', 
          'scripts/sortAndFilter.js', 
          'styles/global.css'

        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  





  // Gestion de l'activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  let cacheWhitelist = [pwa_cache_version];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});