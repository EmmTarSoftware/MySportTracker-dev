// Récupération du chemin de base
const serviceWorkerUrl = self.location.href;
const basePath = serviceWorkerUrl.replace(/service-worker\.js$/, '');

console.log(`[SERVICE WORKER] : BasePath = ${basePath}`);

// Nom de la version du cache
const CACHE_VERSION = "V11";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Fichiers à mettre en cache
const STATIC_FILES = [
  `${basePath}offline.html`,
  `${basePath}Icons/Icon-No-Network.webp` // Exemple d'image pour l'état hors ligne
];

// Liste des fichiers explicites pour les trois dossiers
const ICONS = [
  `${basePath}Icons/Icon-Accepter.webp`,
  `${basePath}Icons/Icon-Autres.webp`,
  `${basePath}Icons/Icon-Delete.webp`,
  `${basePath}Icons/Icon-Download.webp`,
  `${basePath}Icons/Icon-Favoris.webp`,
  `${basePath}Icons/Icon-Favoris-Sel.webp`,
  `${basePath}Icons/Icon-Info.webp`,
  `${basePath}Icons/Icon-New.webp`,
  `${basePath}Icons/Icon-No-Network.webp`,
  `${basePath}Icons/Icon-Profil.webp`,
  `${basePath}Icons/Icon-Return-cancel.webp`,
  `${basePath}Icons/Icon-Setting.webp`,
  `${basePath}Icons/Icon-Stat.webp`,
  `${basePath}Icons/Icon-Trophy.webp`,
  `${basePath}Icons/Icon-Upload.webp`,
  `${basePath}Icons/Icon-Valider.webp`,
  `${basePath}Icons/Logo_MSS-192.png`,
  `${basePath}Icons/Logo_MSS-512.png`,
  `${basePath}Icons/MSS-Logo.ico`
];

const IMAGES = [
  `${basePath}Images/icon-art-martiaux.webp`,
  `${basePath}Images/icon-autre-divers.webp`,
  `${basePath}Images/icon-badminton.webp`,
  `${basePath}Images/icon-baseball.webp`,
  `${basePath}Images/icon-basketball.webp`,
  `${basePath}Images/icon-boxe.webp`,
  `${basePath}Images/icon-breakdance.webp`,
  `${basePath}Images/icon-cap.webp`,
  `${basePath}Images/icon-crossfit.webp`,
  `${basePath}Images/icon-danse.webp`,
  `${basePath}Images/icon-equitation.webp`,
  `${basePath}Images/icon-escalade.webp`,
  `${basePath}Images/icon-football.webp`,
  `${basePath}Images/icon-golf.webp`,
  `${basePath}Images/icon-handball.webp`,
  `${basePath}Images/icon-intense-running.webp`,
  `${basePath}Images/icon-marche.webp`,
  `${basePath}Images/icon-musculation.webp`,
  `${basePath}Images/icon-natation.webp`,
  `${basePath}Images/icon-natation.webp`,
  `${basePath}Images/icon-natation.webp`,
  `${basePath}Images/icon-nautique.webp`,
  `${basePath}Images/icon-patin.webp`,
  `${basePath}Images/icon-rugby.webp`,
  `${basePath}Images/icon-ski.webp`,
  `${basePath}Images/icon-snowboard.webp`,
  `${basePath}Images/icon-sport-co.webp`,
  `${basePath}Images/icon-stretching.webp`,
  `${basePath}Images/icon-tennis.webp`,
  `${basePath}Images/icon-tennis-de-table.webp`,
  `${basePath}Images/icon-triathlon.webp`,
  `${basePath}Images/icon-velo.webp`,
  `${basePath}Images/icon-volley.webp`,
  `${basePath}Images/icon-yoga.webp`
];

const BADGES = [
  `${basePath}Badges/Badge-20-activite.webp`,
  `${basePath}Badges/Badge-absent.webp`,
  `${basePath}Badges/Badge-Muscu-10-seance.webp`,
  `${basePath}Badges/Badge-running-10km.webp`,
  `${basePath}Badges/Badge-running-20km.webp`
];

// Combiner toutes les ressources dans un seul tableau
const ALL_FILES_TO_CACHE = [...STATIC_FILES, ...ICONS, ...IMAGES, ...BADGES];

// Évènement d'installation
self.addEventListener("install", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Installation`);

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Mise en cache des fichiers`);
      await cache.addAll(ALL_FILES_TO_CACHE);
    })()
  );
});

// Évènement d'activation
self.addEventListener("activate", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Activation`);

  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE) {
            console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Suppression de l'ancien cache ${key}`);
            return caches.delete(key);
          }
        })
      );
    })()
  );

  self.clients.claim(); // Contrôler immédiatement les pages
});

// Évènement de fetch (récupération des ressources)
self.addEventListener("fetch", (event) => {
  console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Interception de ${event.request.url}`);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Ressource servie depuis le cache : ${event.request.url}`);
        return cachedResponse; // Servir la ressource en cache si disponible
      }

      console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Ressource non trouvée dans le cache, récupération réseau : ${event.request.url}`);
      return fetch(event.request).then((networkResponse) => {
        return caches.open(STATIC_CACHE).then((cache) => {
          cache.put(event.request, networkResponse.clone()); // Mettre à jour le cache
          return networkResponse;
        });
      }).catch((error) => {
        console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Échec de la récupération réseau : ${event.request.url}`);
        return caches.match(`${basePath}offline.html`); // Page de secours
      });
    })
  );
});

