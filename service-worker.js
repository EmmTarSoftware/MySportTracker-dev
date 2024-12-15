// Récupération du chemin de base
const serviceWorkerUrl = self.location.href;
const basePath = serviceWorkerUrl.replace(/service-worker\.js$/, '');

console.log(`[SERVICE WORKER] : BasePath = ${basePath}`);

// Nom de la version du cache
const CACHE_VERSION = "V15";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Fichiers à mettre en cache
const STATIC_FILES = [
  `${basePath}offline.html`,
  `${basePath}Icons/Icon-No-Network.webp` // image pour l'état hors ligne
];

// Liste des fichiers explicites pour les trois dossiers

// Ici ne pas mettre le fichier Icon-No-Network car déjà dans STATIC_FILES
// Pas de doublon
const ICONS = [
  `${basePath}Icons/Icon-Accepter.webp`,
  `${basePath}Icons/Icon-Autres.webp`,
  `${basePath}Icons/Icon-Delete.webp`,
  `${basePath}Icons/Icon-Download.webp`,
  `${basePath}Icons/Icon-Favoris.webp`,
  `${basePath}Icons/Icon-Favoris-Sel.webp`,
  `${basePath}Icons/Icon-Info.webp`,
  `${basePath}Icons/Icon-New.webp`,
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
  `${basePath}images/icon-art-martiaux.webp`,
  `${basePath}images/icon-autre-divers.webp`,
  `${basePath}images/icon-badminton.webp`,
  `${basePath}images/icon-baseball.webp`,
  `${basePath}images/icon-basketball.webp`,
  `${basePath}images/icon-boxe.webp`,
  `${basePath}images/icon-breakdance.webp`,
  `${basePath}images/icon-cap.webp`,
  `${basePath}images/icon-crossfit.webp`,
  `${basePath}images/icon-danse.webp`,
  `${basePath}images/icon-equitation.webp`,
  `${basePath}images/icon-escalade.webp`,
  `${basePath}images/icon-football.webp`,
  `${basePath}images/icon-golf.webp`,
  `${basePath}images/icon-handball.webp`,
  `${basePath}images/icon-intense-running.webp`,
  `${basePath}images/icon-marche.webp`,
  `${basePath}images/icon-musculation.webp`,
  `${basePath}images/icon-natation.webp`,
  `${basePath}images/icon-nautique.webp`,
  `${basePath}images/icon-patin.webp`,
  `${basePath}images/icon-rugby.webp`,
  `${basePath}images/icon-ski.webp`,
  `${basePath}images/icon-snowboard.webp`,
  `${basePath}images/icon-sport-co.webp`,
  `${basePath}images/icon-stretching.webp`,
  `${basePath}images/icon-tennis.webp`,
  `${basePath}images/icon-tennis-de-table.webp`,
  `${basePath}images/icon-triathlon.webp`,
  `${basePath}images/icon-velo.webp`,
  `${basePath}images/icon-volley.webp`,
  `${basePath}images/icon-yoga.webp`
];

const BADGES = [
  `${basePath}Badges/Badge-20-activite.webp`,
  `${basePath}Badges/Badge-absent.webp`,
  `${basePath}Badges/Badge-Muscu-10-seance.webp`,
  `${basePath}Badges/Badge-running-10km.webp`,
  `${basePath}Badges/Badge-running-20km.webp`
];


// Combiner toutes les ressources dans un seul tableau et dédupliquer
//Ajout de Set pour s'assurer qu'aucune URL dupliquée ne soit incluse dans ALL_FILES_TO_CACHE
const ALL_FILES_TO_CACHE = [...new Set([...STATIC_FILES, ...ICONS, ...IMAGES, ...BADGES])];

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
  console.log(`[SERVICE WORKER] : Activation`);

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
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      // Vérifier si la ressource est dans le cache
      const cachedResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Mettre à jour le cache avec la réponse réseau
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch((error) => {
          console.log(`[SERVICE WORKER] : ${CACHE_VERSION} Erreur réseau pour ${event.request.url}`);
          return cachedResponse; // Utiliser la réponse en cache en cas d'échec
        });

      // Retourner la réponse en cache immédiatement, tout en récupérant une nouvelle version en arrière-plan
      return cachedResponse || fetchPromise;
    })()
  );
});
