

let allDivHomeToDisplayNone = ["divMainBtnMenu","btnNewActivity","divFilterSort","divItemList"],
    allDivHomeToDisplayBlock = ["divMainBtnMenu","btnNewActivity"],
    allDivHomeToDisplayFlex = ["divFilterSort","divItemList"];




// Récupère les date du jours et de la veille

function onFindDateTodayUS() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

// La date d'hier
function onFindDateYesterdayUS() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Soustrait un jour à la date actuelle
    
    let year = yesterday.getFullYear();
    let month = String(yesterday.getMonth() + 1).padStart(2, '0');
    let day = String(yesterday.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};


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
            onChangeDisplay(["divBtnTemplateChoice","divTemplateChoice"],["divBtnActivity"],["divActivityEditor"],[],[],["btnDeleteActivity"],[]);
        break;
        case "EditActivity":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : EditActivity");};
            pMenuTitleRef.innerHTML = "Editer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],[],["btnDeleteActivity"]);
        break;
        case "TemplateChoice":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour nouveau menu : TemplateChoice");};
            pMenuTitleRef.innerHTML = "Sélection d'un modèle";
            onCreateTemplateChoiceList();
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnTemplateChoice"],["divTemplateChoice"],[],[],[],[]);
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
            pMenuTitleRef.innerHTML = "Modèles";
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
            onChangeDisplay(["divActivityEditor","divBtnActivity"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],["divActivityEditor","divBtnActivity"],[],[]);
        break;
        case "TemplateChoice":
            if (devMode === true){console.log("[ NAVIGATION ] Traitement pour quitter le menu : TemplateChoice");};
            onChangeDisplay(["divTemplateChoice","divBtnTemplateChoice"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],["divActivityEditor","divBtnActivity"],[],[]);
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
            pMenuTitleRef.innerHTML = "Modèles";
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










let db,
    dbName = "MSS-DataBase",
    activityStoreName = "activityList",
    profilStoreName = "profil",
    rewardsStoreName = "Recompenses",
    settingStoreName = "Setting",
    templateStoreName = "Template",
    // Nom des stores à importer et exporter dans les fonctions import export. 
    storeNames = [activityStoreName, profilStoreName, rewardsStoreName,settingStoreName],//Ajouter tous les noms des stores ici
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

        db = openRequest.result;
        if(!db.objectStoreNames.contains(activityStoreName)){
            // si le l'object store n'existe pas
            let activityStore = db.createObjectStore(activityStoreName, {keyPath:'key', autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE] Creation du magasin " + activityStoreName);};

            activityStore.createIndex('date','date',{unique:false});
            activityStore.createIndex('distance','distance',{unique:false});
            activityStore.createIndex('duration','duration',{unique:false});
        };

        // Création du store "template"
        if(!db.objectStoreNames.contains(templateStoreName)){
            // si le l'object store n'existe pas
            let templateStore = db.createObjectStore(templateStoreName, {keyPath:'key', autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE] Creation du magasin " + templateStoreName);};

            templateStore.createIndex('title','title',{unique:true});
            templateStore.createIndex('activityName','activityName',{unique:false});
        };

        // Creation du store pour le profil
        if (!db.objectStoreNames.contains(profilStoreName)) {
            let profilStore = db.createObjectStore(profilStoreName, {keyPath:'key',autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE PROFIL] Creation du magasin " + profilStoreName);};

            isNewProfilRequiered = true;
        };


        // Creation du store pour les Setting
        if (!db.objectStoreNames.contains(settingStoreName)) {
            let profilStore = db.createObjectStore(settingStoreName, {keyPath:'key',autoIncrement: true});
            if (devMode === true){console.log("[ DATABASE PROFIL] Creation du magasin " + settingStoreName);};

            isNewSettingBdDRequired = true;
        };

        // Creation du store pour les récompenses
        if (!db.objectStoreNames.contains(rewardsStoreName)) {
            // Création du store avec une clé personnalisée
            let rewardsStore = db.createObjectStore(rewardsStoreName, {keyPath: "rewardsKey"});
            if (devMode === true) {
                console.log("[DATABASE] Création du magasin " + rewardsStoreName);
            }
            isNewRewardsBdDRequired = true;
        };
        
        // Stoque le numéro de version de base de l'application
        localStorage.setItem(cookiesBddVersion_KeyName, currentBaseVersion.toString());

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        if (devMode === true){console.log("[ DATABASE] Base ready");};


        if (isNewProfilRequiered === true) {
            // Creation d'un profil par defaut dans la base
            if (devMode === true){console.log("[ DATABASE PROFIL] demande de création du profil par defaut");};
            onCreateDefaultProfilInBase(userInfo);
        }else{
            // Lancement des éléments du profil
            onExtractProfilFromDB();
        };
        

        if (isNewSettingBdDRequired === true) {
            // Creation d'un paramètre par defaut dans la base
            if (devMode === true){console.log("[ DATABASE PROFIL] demande de création des paramètres par defaut");};
            onCreateDefaultSettingInBase(defaultSetting);
        }else{
            // Lancement des éléments du paramètre
            onExtractSettingFromDB();
        };

        if (isNewRewardsBdDRequired === true) {
            // Creation d'un profil par defaut dans la base
            if (devMode === true){console.log("[ DATABASE REWARDS] demande de création d'un ARRAY par defaut");};
            onCreateDefaultRewardsInBase();
        }else{
            // Lancement des éléments du profil
            onExtractRewardsFromDB();
        };


        //extraction des modèles de la base
        onUpdateTemplateBddList(false);
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
  

  