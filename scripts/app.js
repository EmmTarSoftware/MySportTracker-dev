

let allDivHomeToDisplayNone = ["divMainBtnMenu","btnNewActivity","divFilterSort","divItemList"],
    allDivHomeToDisplayBlock = ["divMainBtnMenu","btnNewActivity"],
    allDivHomeToDisplayFlex = ["divFilterSort","divItemList"];




let dateToday = onFindDateTodayUS(),
    dateYesterday = onFindDateYesterdayUS();




// NAVIGATION DANS LES MENUS 

// reference le "p" qui contient le titre du menu pour le changer
let pMenuTitleRef = document.getElementById("pMenuTitle");


function onChangeMenu(menuTarget) {

    if (devMode === true){console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);};




    switch (menuTarget) {
        case "Favoris":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Favoris");};
            pMenuTitleRef.innerHTML = "Activités / Favoris";
            onChangeDisplay(allDivHomeToDisplayNone,["divFavoris","divBtnFavoris"],[],[],[],[],[]);
            onOpenMenuFavoris();
        break;
        case "Stat":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Stat");};
            pMenuTitleRef.innerHTML = "Statistiques";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnStat"],["divStat"],[],[],[],[]);
            onOpenMenuStat();
        break;
        case "Rewards":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Rewards");};
            pMenuTitleRef.innerHTML = "Récompenses";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnRewards"],["divRewards"],[],[],[],[]);

            // Enlève la couleur si il ya un reward en cours
            if (document.getElementById("btnMenuRewards").classList.contains("rewardAvailable")) {
                document.getElementById("btnMenuRewards").classList.remove("rewardAvailable");
            };

            onOpenMenuRewards();
        break;
        case "NewActivity":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : New Activity");};
            pMenuTitleRef.innerHTML = "Créer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],["btnDeleteActivity"],[]);
            onOpenNewActivity();
        break;
        case "NewActivityFromTemplate":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : NewActivityFromTemplate");};
            pMenuTitleRef.innerHTML = "Créer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],["btnDeleteActivity"],[]);
        break;
        case "EditActivity":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : EditActivity");};
            pMenuTitleRef.innerHTML = "Editer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],[],["btnDeleteActivity"]);
        break;
        case "TemplateChoice":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : TemplateChoice");};
            onCreateTemplateChoiceList();
            onChangeDisplay([],[],["divTemplateChoice"],[],[],[],[]);
        break;

        
        // Menu supplémentaire

        case "Profil":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Profil");};
            pMenuTitleRef.innerHTML = "Mon profil";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnProfil"],["divProfil"],[],[],[],[]);
            onOpenMenuProfil();
        break;
        case "GestData":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : GestData");};
            pMenuTitleRef.innerHTML = "Gestion des données";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnGestData"],["divGestData"],[],[],[],[]);
            onOpenMenuGestData();
        break;
        case "GestTemplate":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : GestTemplate");};
            pMenuTitleRef.innerHTML = "Gestion des modèles";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnGestTemplate"],["divGestTemplate"],[],[],[],[]);
            onOpenMenuGestTemplate();
        break;
        case "NewTemplate":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : NewTemplate");};
            pMenuTitleRef.innerHTML = "Création de modèle";
            onChangeDisplay(["divBtnGestTemplate","divGestTemplate"],["divBtnTemplateEditor"],["divTemplateEditor"],[],[],["btnDeleteTemplate"],[]);
            onClickBtnCreateTemplate();
        break;
        case "ModifyTemplate":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : TemplateEditor");};
            pMenuTitleRef.innerHTML = "Modification de modèle";
            onChangeDisplay(["divBtnGestTemplate","divGestTemplate"],["divBtnTemplateEditor"],["divTemplateEditor"],[],[],[],["btnDeleteTemplate"]);
        break;
        case "Setting":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Setting");};
            pMenuTitleRef.innerHTML = "Paramètres";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnSetting"],["divSetting"],[],[],[],[]);
            onOpenMenuSetting();
        break;
        case "Info":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : Info");};
            pMenuTitleRef.innerHTML = "A propos";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnInfo"],["divInfo"],[],[],[],[]);
            onOpenMenuInfo();
        break;

        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu = " + menuTarget);
        break;
    };

};




// Les menus supplémentaires
function onClickMainMenuSup(){
    onChangeDisplay(["btnNewActivity"],[],["divMainMenuSup"],[],[],[],[]);

    if (templateAvailable) {
        document.getElementById("btnNewFromTemplate").style.display = "none";
        if (devMode === true){console.log("HIDE : btnNewFromTemplate");};
    }
};
function onClickMenuSup(event,target) {
    event.stopPropagation();
    document.getElementById("divMainMenuSup").style.display = "none";

    onChangeMenu(target);
};

function onAnnulMenuSup(){
    if (devMode === true){console.log("[ NAVIGATION ] Annulation menu supplémentaire");};
    onChangeDisplay(["divMainMenuSup"],["btnNewActivity"],[],[],[],[],[]);

    if (templateAvailable) {
        document.getElementById("btnNewFromTemplate").style.display = "block";
        if (devMode === true){console.log("Display : btnNewFromTemplate");};
    }
};





function onLeaveMenu(menuTarget) {

    if (devMode === true){console.log(" [ NAVIGATION ] Demande de changement menu demandé par : " + menuTarget);};

    // remet le titre initial du menu
    // reference le "p" qui contient le titre du menu pour le changer
    let pMenuTitleRef = document.getElementById("pMenuTitle");
    pMenuTitleRef.innerHTML = "Mon Suivi Sportif";

    switch (menuTarget) {

        case "Favoris":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Favoris");};
            onChangeDisplay(["divFavoris","divBtnFavoris"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Stat":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Stat");};
            onChangeDisplay(["divStat","divBtnStat"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Rewards":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Rewards");};
            onChangeDisplay(["divRewards","divBtnRewards"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Activity":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Activity");};
            onResetBtnRadio();
            onChangeDisplay(["divActivityEditor","divBtnActivity"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],["divActivityEditor","divBtnActivity"],[],[]);
        break;

        // Condition utilisateur

        case "userCondition":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : UserCondition");};
            onChangeDisplay(["divConditionUtilisation"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;

        
        //  Menu supplementaire

        case "Profil":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Profil");};
            onChangeDisplay(["divProfil","divBtnProfil"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "GestData":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : GestData");};
            onChangeDisplay(["divGestData","divBtnGestData"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "GestTemplate":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : GestTemplate");};
            onChangeDisplay(["divGestTemplate","divBtnGestTemplate"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "TemplateEditor":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : TemplateEditor");};
            onChangeDisplay(["divBtnTemplateEditor","divTemplateEditor"],["divBtnGestTemplate"],["divGestTemplate"],[],[],[],[]);
            pMenuTitleRef.innerHTML = "Gestion des modèles";
            onResetBtnRadio();
        break;
        case "Setting":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Setting");};
            onChangeDisplay(["divSetting","divBtnSetting"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Info":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Info");};
            onChangeDisplay(["divInfo","divBtnInfo"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;


        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le menu = " + menuTarget);
        break;
    };

};




// ------------------------- CONDITION D'UTILISATION ---------------------------











let cookiesConditionUtilisation_keyName = "MSS-ConditionAccepted";

function onCheckConditionUtilisation() {
    if (localStorage.getItem(cookiesConditionUtilisation_keyName) === null) {
        localStorage.setItem(cookiesConditionUtilisation_keyName,false);
        if (devMode === true){console.log(" Creation du cookies : " + cookiesConditionUtilisation_keyName);};
    };

    if (devMode === true){console.log(localStorage.getItem(cookiesConditionUtilisation_keyName));};
    if (localStorage.getItem(cookiesConditionUtilisation_keyName) === "false") {
        onGenerateConditionUtilisation();
    };
};



function onGenerateConditionUtilisation() {
    onChangeDisplay(allDivHomeToDisplayNone,["divConditionUtilisation"],[],[],[],["launch-btn"],[]);
    if (devMode === true){console.log("Génération du popup des conditions d'utilisation");};

};

// Acceptation des conditions d'utilisations

function onClickAcceptCondition() {
    localStorage.setItem(cookiesConditionUtilisation_keyName,true);
    if (devMode === true){console.log("Acceptation des conditions d'utilisation");};

    onLeaveMenu("userCondition");
};

// gestion de la Checkbox d'acceptation
function toggleLaunchButton() {
    let selectStatusConditionRef = document.getElementById("selectStatusCondition");
    let launchBtn = document.getElementById("launch-btn");
    launchBtn.style.visibility = selectStatusConditionRef.value === "Accepted" ? "visible" : "hidden";
};

onCheckConditionUtilisation();
















// ------------------------------  LANCEMENT création de la base de donnée ------------------------------










let db_old,
    dbName = "MSS-DataBase",
    activityStoreName = "ActivityList",
    activityCounterStoreName = "ActivityCount",
    profilStoreName = "Profil",
    rewardsStoreName = "Recompenses",
    settingStoreName = "Setting",
    templateStoreName = "Template",
    templateCounterStoreName = "TemplateCount",
    favorisStoreName = "Favoris",
    // Nom des stores à importer et exporter dans les fonctions import export. 
    storeNames = [activityStoreName, profilStoreName, rewardsStoreName,settingStoreName,templateStoreName],//Ajouter tous les noms des stores ici
    currentBaseVersion = 7,
    cookiesBddVersion_KeyName = "MSS-bddVersion";
    







//fonction de lancement de la base.
//La liste d'activité est lancé après le menu paramètre 
function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,currentBaseVersion);

    let isNewProfilRequiered = false,//boolean pour savoir si je créer un nouveau profils ou non
        isNewRewardsBdDRequired = false,//boolean pour savoir si je créer un élément initiale pour les récompenses dans la base
        isNewSettingBdDRequired = false;//boolean pour savoir si je créer un élément initiale pour les setting dans la base
    // Traitement selon résultat

   
    // Mise à jour ou création requise
    openRequest.onupgradeneeded = function () {
        if (devMode === true){console.log(" [ DATABASE] Initialisation de la base de donnée");};

        db_old = openRequest.result;
        if(!db_old.objectStoreNames.contains(activityStoreName)){
            // si le l'object store n'existe pas
            let activityStore = db_old.createObjectStore(activityStoreName, {keyPath:'key', autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE] Creation du magasin " + activityStoreName);};

            activityStore.createIndex('date','date',{unique:false});
            activityStore.createIndex('distance','distance',{unique:false});
            activityStore.createIndex('duration','duration',{unique:false});
        };

        // Creation du store pour les Setting
        if (!db_old.objectStoreNames.contains(settingStoreName)) {
            let profilStore = db_old.createObjectStore(settingStoreName, {keyPath:'key',autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE PROFIL] Creation du magasin " + settingStoreName);};

            isNewSettingBdDRequired = true;
        };
        
        // Stoque le numéro de version de base de l'application
        localStorage.setItem(cookiesBddVersion_KeyName, currentBaseVersion.toString());

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db_old = openRequest.result
        if (devMode === true){console.log("[ DATABASE] Base ready");};
        

        if (isNewSettingBdDRequired === true) {
            // Creation d'un paramètre par defaut dans la base
            if (devMode === true){console.log("[ DATABASE PROFIL] demande de création des paramètres par defaut");};
            onCreateDefaultSettingInBase(defaultSetting);
        }else{
            // Lancement des éléments du paramètre
            onExtractSettingFromDB();
        };


    };


};



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



onStartDataBase();




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
const db = new PouchDB(dbName);

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
    await createStore(profilStoreName, { type: profilStoreName, pseudo: "", customNotes: "" });
    await createStore(settingStoreName, {
        type: settingStoreName,
        displayCommentDoneMode: "Collapse",
        displayCommentPlannedMode: "Collapse",
        isAutoSaveEnabled: false,
        lastAutoSaveDate: "noSet",
        lastAutoSaveTime: "",
        lastManualSaveDate: "noSet",
        lastManualSaveTime: "",
        autoSaveFrequency: 7
    });
    await createStore(rewardsStoreName, { type: rewardsStoreName, rewards: [] });
}



// Pour la création du store de conteur d'ID pour template
async function onInitTemplateCounterStore() {
    try {
        // Vérifier si le compteur existe déjà
        let counterDoc = await db.get(templateCounterStoreName).catch(() => null);

        if (!counterDoc) {
            // Créer le store avec un compteur initial
            counterDoc = { _id: templateCounterStoreName, type: templateCounterStoreName, counter: 0 };
            await db.put(counterDoc);
            if (devMode === true ) {console.log("[DATABASE] [TEMPLATE] Store Compteur template créé :", counterDoc);};
        }
    } catch (err) {
        console.error("[DATABASE] [TEMPLATE] Erreur lors de l'initialisation du compteur :", err);
    }
}



// Pour la création du store de conteur d'ID pour les activité
async function onInitActivityCounterStore() {
    try {
        // Vérifier si le compteur existe déjà
        let counterDoc = await db.get(activityCounterStoreName).catch(() => null);

        if (!counterDoc) {
            // Créer le store avec un compteur initial
            counterDoc = { _id: activityCounterStoreName, type: activityCounterStoreName, counter: 0 };
            await db.put(counterDoc);
            if (devMode === true ) {console.log("[DATABASE] [ACTIVITY] Store Compteur template créé :", counterDoc);};
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
            userSetting = { ...settings };
        }

        if (devMode === true){console.log("[DATABASE] Données chargées :", { userInfo, userRewardsArray, userFavoris, userSetting });};
    } catch (err) {
        console.error("[DATABASE] Erreur lors du chargement des stores :", err);
    }
}



// fonction pour récupérer les activité et les modèles
async function onLoadActivityFromDB () {
    allUserActivityArray = [];
    try {
        const result = await db.allDocs({ include_docs: true }); // Récupère tous les documents

        // Filtrer les éléments concernée
        allUserActivityArray = result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === activityStoreName);
            if (devMode === true){console.log("[DATABASE] [ACTIVITY] Activités chargées :", activityStoreName);};
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors du chargement:", err);
    }
}





// Procésus de lancement de l'application
async function initApp() {
    await onCreateDBStore();  // 1️⃣ Création des stores
    await onLoadStores();       // 2️⃣ Extraction des données des stores génériques
    await onLoadActivityFromDB(); // 3️⃣Extraction liste activité
    await onLoadTemplateFromDB(); // Extraction liste modèle
    await onInitActivityCounterStore();// Extraction liste modèle
    await onInitTemplateCounterStore();// Extraction liste modèle
}


// Appel de la fonction après l'initialisation
initApp().then(() => firstActualisation());

function firstActualisation() {
    if (devMode === true){console.log("Première actualisation")};


    //PROFIL : set dans le html, le nom de l'utilisateur
    document.getElementById("userPseudo").innerHTML = userInfo.pseudo;

    // FAVORIS
    onGenerateActivityOptionChoice("selectorCategoryChoice");
    onGenerateFakeOptionList("divFakeSelectOptList");

    // Prémière actualisation des modèles
    onUpdateTemplateList(false);

}