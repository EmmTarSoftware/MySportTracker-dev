



// ------------------------- CONDITION D'UTILISATION ---------------------------



function onGenerateConditionUtilisation() {
    // Insert les conditions dynamique dans l'emplacement
    document.getElementById("divConditionDynamicText").innerHTML = conditionText;
    // Affichage
    onChangeDisplay(allDivHomeToDisplayNone,["divConditionUtilisation"],[],[],[],["launch-btn"],[]);
    if (devMode === true){console.log("Génération du popup des conditions d'utilisation");};

};

// Acceptation des conditions d'utilisations

function onClickAcceptCondition() {
    if (devMode === true){console.log("Acceptation des conditions d'utilisation");};

    userInfo.conditionAccepted = true;
    onInsertProfilModificationInDB(userInfo);

    onLeaveMenu("userCondition");
};

// gestion de la Checkbox d'acceptation
function toggleLaunchButton() {
    let selectStatusConditionRef = document.getElementById("selectStatusCondition");
    let launchBtn = document.getElementById("launch-btn");
    launchBtn.style.visibility = selectStatusConditionRef.value === "Accepted" ? "visible" : "hidden";
};


















// ------------------------------  LANCEMENT création de la base de donnée ------------------------------










let db_old,
    dbName = "MSS-DataBase",
    activityStoreName = "ActivityList",
    activityCountIDStoreName = "ActivityCount",
    profilStoreName = "Profil",
    rewardsStoreName = "Recompenses",
    settingStoreName = "Setting",
    templateStoreName = "Template",
    templateCountIDStoreName = "TemplateCount",
    favorisStoreName = "Favoris",
    sessionStoreName = "Sessions",
    counterCountIDStoreName = "CounterCount",
    sessionStartTimeStoreName = "SessionStartTime",
    // Nom des stores à importer et exporter dans les fonctions import export. 
    storeNames = [activityStoreName, profilStoreName, rewardsStoreName,settingStoreName,templateStoreName],//Ajouter tous les noms des stores ici
    currentBaseVersion = 7,
    cookiesBddVersion_KeyName = "MSS-bddVersion";
    









//--------------------------------- BOUTON FLOTTANT ---------------------------



const btnNewActivityRef = document.getElementById('btnNewActivity');
const btnNewFromTemplateRef = document.getElementById("btnNewFromTemplate");
let lastScrollTop = 0;
let scrollTimeout;


// Écoute de l'événement scroll sur la div
divItemListRef.addEventListener('scroll', () => {
    // Cache le bouton dès qu'il y a un mouvement de scroll
    btnNewActivityRef.classList.add('hidden');
    btnNewFromTemplateRef.classList.add('hidden');

    // Empêche le bouton de réapparaître immédiatement
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        btnNewActivityRef.classList.remove('hidden');
        btnNewFromTemplateRef.classList.remove('hidden');
    }, 200); // Réapparaît après 200ms une fois le scroll arrêté
});

 

// Detection de l'environnement (test prod ou local)
console.log("Environnement : ", window.envConfig.environment);
if (window.envConfig.environment != "production") {
    document.getElementById("divHeader").classList.add("header-dev");
    console.log("configuration style dev");
}






// ----------------------------- gestion PERSISTANCE DATA BASE --------------------------------------------



//   Base persistante ?
async function checkIfPersistent() {
    if (navigator.storage && navigator.storage.persisted) {
      const isPersisted = await navigator.storage.persisted();
      console.log(`Le stockage est ${isPersisted ? "persistant" : "volatil"}.`);

        //   Si ne l'est pas, demande à l'utilisateur
        if (!isPersisted) {
            console.log("Base non persistante. Demande à l'utilisateur");
            requestPersistentStorage();
        }

    } else {
      console.warn("L'API StorageManager n'est pas disponible.");
    }
}
  
  // Vérifie si le stockage est persistant
  checkIfPersistent();



// Fonction de demande de persistance
async function requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
        if (isPersisted) {
            console.log("Le stockage est maintenant persistant.");
        } else {
            console.log("Impossible de rendre le stockage persistant.");
        }
    } else {
      console.warn("L'API StorageManager n'est pas disponible.");
    }
}
  

// -----------------------------------  pouch DB -------------------------------------





// Créer (ou ouvrir si elle existe déjà) une base de données PouchDB
let  db = new PouchDB(dbName, { auto_compaction: true });//avec la suppression automatique des anciennes révisions

// Vérifier si la base est bien créée
db.info().then(info => console.log(' [DATABASE] Base créée/ouverte :', info));



// Création des éléments de base
async function onCreateDBStore() {
    async function createStore(storeId, data) {
        try {
            let existing;
            try {
                existing = await db.get(storeId);
            } catch (err) {
                if (err.status !== 404) { // Si ce n'est pas une erreur "document non trouvé", on affiche l'erreur
                    console.error(`[DATABASE] Erreur lors de la vérification du store ${storeId}:`, err);
                    return;
                }
                existing = null;
            }

            if (!existing) {
                await db.put({ _id: storeId, ...data });
                console.log(`[DATABASE] Création du store ${storeId.toUpperCase()}`);
            } else {
                console.log(`[DATABASE] Le store ${storeId.toUpperCase()} existe déjà`);
            }
        } catch (err) {
            console.error(`[DATABASE] Erreur lors de la création du store ${storeId}:`, err);
        }
    }

    // Création des stores
    await createStore(favorisStoreName, { type: favorisStoreName, favorisList: [] });
    await createStore(profilStoreName, { 
        type: profilStoreName, pseudo: "", 
        customNotes: "",
        conditionAccepted : false 
    });
    await createStore(settingStoreName, {
        type: settingStoreName,
        agenda : "NONE",
        agendaScheduleStart:"08:00",
        agendaScheduleEnd:"10:00",
        displayCommentDoneMode: "Collapse",
        displayCommentPlannedMode: "Collapse",
        isAutoSaveEnabled: false,
        lastAutoSaveDate: "noSet",
        lastAutoSaveTime: "",
        lastManualSaveDate: "noSet",
        lastManualSaveTime: "",
        autoSaveFrequency: 7,
        devMode:false
    });
    await createStore(rewardsStoreName, { type: rewardsStoreName, rewards: [] });
    await createStore(sessionStoreName, { type: sessionStoreName, counterList: {} });
    await createStore(sessionStartTimeStoreName,{type: sessionStartTimeStoreName, startTime:"00:00:00"});
    await onInitActivityCountIDStore(); 
    await onInitTemplateCountIDStore();
    await onInitCounterCountIDStore();
}



// Pour la création du store de compteur d'ID pour template
async function onInitTemplateCountIDStore() {
    try {
        // Vérifier si le compteur existe déjà
        let counterDoc = await db.get(templateCountIDStoreName).catch(() => null);

        if (!counterDoc) {
            // Créer le store avec un compteur initial
            counterDoc = { _id: templateCountIDStoreName, type: templateCountIDStoreName, counter: 0 };
            await db.put(counterDoc);
                console.log("[DATABASE] [TEMPLATE] Store Compteur template créé :", counterDoc);
        }else{
            console.log("[DATABASE] [TEMPLATE] Store Compteur template Existe déjà :", counterDoc);
        }
    } catch (err) {
        console.error("[DATABASE] [TEMPLATE] Erreur lors de l'initialisation du compteur :", err);
    }
}



// Pour la création du store de compteur d'ID pour les activité
async function onInitActivityCountIDStore() {
    try {
        // Vérifier si le compteur existe déjà
        let counterDoc = await db.get(activityCountIDStoreName).catch(() => null);

        if (!counterDoc) {
            // Créer le store avec un compteur initial
            counterDoc = { _id: activityCountIDStoreName, type: activityCountIDStoreName, counter: 0 };
            await db.put(counterDoc);
            console.log("[DATABASE] [ACTIVITY] Store Compteur activité créé :", counterDoc);
        }else{
            console.log("[DATABASE] [ACTIVITY] Store Compteur activité Existe déjà :", counterDoc);
        }
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors de l'initialisation du compteur :", err);
    }
}


// Pour la création du store de compteur d'ID pour les compteurs (les objects du menu compteur)
async function onInitCounterCountIDStore() {
    try {
        // Vérifier si le compteur existe déjà
        let counterDoc = await db.get(counterCountIDStoreName).catch(() => null);

        if (!counterDoc) {
            // Créer le store avec un compteur initial
            counterDoc = { _id: counterCountIDStoreName, type: counterCountIDStoreName, counter: 0 };
            await db.put(counterDoc);
            console.log("[DATABASE] [ACTIVITY] Store Compteur activité créé :", counterDoc);
        }else{
            console.log("[DATABASE] [ACTIVITY] Store Compteur activité Existe déjà :", counterDoc);
        }
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors de l'initialisation du compteur :", err);
    }
}






// Fonction pour récupérer les données des stores
async function onLoadStores() {
    try {
        const profil = await db.get(profilStoreName).catch(() => null);
        if (profil) {
            userInfo.pseudo = profil.pseudo;
            userInfo.customNotes = profil.customNotes;
            userInfo.conditionAccepted = profil.conditionAccepted;
        }

        const rewards = await db.get(rewardsStoreName).catch(() => null);
        if (rewards) {
            userRewardsArray = rewards.rewards;
        }

        const favoris = await db.get(favorisStoreName).catch(() => null);
        if (favoris) {
            userFavoris = favoris.favorisList;
        }

        const settings = await db.get(settingStoreName).catch(() => null);
        if (settings) {

            userSetting = {
                agenda : settings.agenda || "NONE",
                agendaScheduleStart: settings.agendaScheduleStart || "08:00",
                agendaScheduleEnd: settings.agendaScheduleEnd || "10:00",
                displayCommentDoneMode : settings.displayCommentDoneMode,
                displayCommentPlannedMode : settings.displayCommentPlannedMode,
                isAutoSaveEnabled : settings.isAutoSaveEnabled,
                lastAutoSaveDate : settings.lastAutoSaveDate,
                lastAutoSaveTime : settings.lastAutoSaveTime,
                lastManualSaveDate : settings.lastManualSaveDate,
                lastManualSaveTime :settings.lastManualSaveTime,
                autoSaveFrequency : settings.autoSaveFrequency,
                devMode : settings.devMode
            };
        }

        if (devMode === true){console.log("[DATABASE] Données chargées :", { userInfo, userRewardsArray, userFavoris, userSetting });};
    } catch (err) {
        console.error("[DATABASE] Erreur lors du chargement des stores :", err);
    }
}







// Procésus de lancement de l'application
async function initApp() {
    await onCreateDBStore();  // 1️⃣ Création des stores
    await onLoadStores();       // 2️⃣ Extraction des données des stores génériques
    await onLoadActivityFromDB(); // 3️⃣Extraction liste activité
    await onLoadTemplateFromDB(); // Extraction liste modèle
}


// Appel de la fonction après l'initialisation
initApp().then(() => firstActualisation());

async function firstActualisation() {


    // Set le devMode

    devMode = userSetting.devMode;

    if (devMode === true){console.log("Première actualisation")};


    // CONDITION UTILISATION
    if (userInfo.conditionAccepted === false) {
        onGenerateConditionUtilisation();
    }
    console.log("userInfo.ConditionAccepted : " + userInfo.conditionAccepted );

    //PROFIL : set dans le html, le nom de l'utilisateur
    document.getElementById("customInfo").innerHTML = userInfo.pseudo;

    // FAVORIS
    onGenerateActivityOptionChoice("selectorCategoryChoice");
    onGenerateFakeOptionList("divFakeSelectOptList");


    // SETTING
    // Met à jour les css du mode d'affichage selon les paramètres
    currentCommentDoneClassName = onSearchCommentClassNameByMode(userSetting.displayCommentDoneMode);
    currentCommentPlannedClassName = onSearchCommentClassNameByMode(userSetting.displayCommentPlannedMode);


    // Traitement sauvegarde automatique
    if (userSetting.isAutoSaveEnabled) {
        console.log("[SETTING] Autosave activée.");
        if (devMode === true){console.log("[SETTING] Autosave activité. Demande de vérification des conditions");};

        // Vérification des conditions
        let isSaveRequired = await onCheckAutoSaveCondition();
        console.log("Sauvegarde Automatique nécessaire :", isSaveRequired);

        if (isSaveRequired) {
            eventSaveData(true);
        }

    }


    // ACTIVITY
    // Generation du trie dynamique
    onGenerateDynamiqueFilter(allUserActivityArray);

    // Lancement de l'actualisation sur le filtre en cours
    onFilterActivity(currentSortType,currentFilter,allUserActivityArray);

    // TEMPLATE
    onUpdateTemplateList(false);

}