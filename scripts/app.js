// Variable globales



// SERVICE WORKER pour mode HORS LIGNE
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration);
  
          // Vérifier si un nouveau Service Worker est disponible
          registration.update();
  
          // Lorsque le Service Worker est activé, vérifier si une nouvelle version est disponible
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Le Service Worker a été mis à jour, peux notifier l'utilisateur
                  console.log('Nouvelle version disponible, recharger l\'application.');
                  window.location.reload(); // Redémarre l'application pour activer la nouvelle version
                }
              };
            }
          };
        })
        .catch((error) => {
          console.log('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
  

























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


function onChangeMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);

    // reference le "p" qui contient le titre du menu pour le changer
    let pMenuTitleRef = document.getElementById("pMenuTitle");


    switch (menuTarget) {
        case "Profil":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Profil");
            pMenuTitleRef.innerHTML = "Mon profil";
            onChangeDisplay(["divMainBtnMenu","divHome"],["divProfil"],[],[],[],[]);
            onOpenMenuProfil();
        break;
        case "Setting":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Setting");
            pMenuTitleRef.innerHTML = "Paramètres";
            onChangeDisplay(["divMainBtnMenu","divHome"],["divSetting"],[],[],[],[]);
            onOpenMenuSetting();
        break;


        case "Info":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Info");
            pMenuTitleRef.innerHTML = "Information";
            onChangeDisplay(["divMainBtnMenu","divHome"],["divInfo"],[],[],[],[]);
            onOpenMenuInfo();
        break;

        case "NewActivity":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : New Activity");
            pMenuTitleRef.innerHTML = "Créer une activité";
            onChangeDisplay(["divMainBtnMenu","divHome"],["divActivityEditor"],[],[],["btnDeleteActivity",],[]);
            onOpenNewActivity();
        break;

        case "EditActivity":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : EditActivity");
            pMenuTitleRef.innerHTML = "Editer une activité";
            onChangeDisplay(["divMainBtnMenu","divHome"],["divActivityEditor"],[],[],[],["btnDeleteActivity"]);
        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu = " + menuTarget);
        break;
    };

};






function onLeaveMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);

    // remet le titre initial du menu
    // reference le "p" qui contient le titre du menu pour le changer
    let pMenuTitleRef = document.getElementById("pMenuTitle");
    pMenuTitleRef.innerHTML = "Mon Suivit Sportif";

    switch (menuTarget) {
        case "Profil":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Profil");
            onChangeDisplay(["divProfil"],["divMainBtnMenu","divHome"],[],[],[],[]);
        break;
        case "Setting":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Setting");
            onChangeDisplay(["divSetting"],["divMainBtnMenu","divHome"],[],[],[],[]);
        break;
        case "Info":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Info");
            onChangeDisplay(["divInfo"],["divMainBtnMenu","divHome"],[],[],[],[]);

        break;
        case "Activity":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Activity");
            onChangeDisplay(["divActivityEditor"],["divMainBtnMenu","divHome"],[],["divActivityEditor"],[],[]);
        break;
        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le menu = " + menuTarget);
        break;
    };

};



// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplay,toDisable,toEnable,visibilityOFF,visibilityON) {
    // Cache les items
    toHide.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items
    toDisplay.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });


    // Desactive les items
    toDisable.forEach(id=>{
       let itemRef = document.getElementById(id);
       itemRef.style.opacity = 0.1;
       itemRef.style.pointerEvents = "none";
    });

    // Active les items
    toEnable.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.opacity = 1;
        itemRef.style.pointerEvents = "all";
    });



    // Visibilité OFF pour les items
    visibilityOFF.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "hidden";
    });

    // Visibilité ON pour les items
    visibilityON.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "visible";
    });


};


//formatage =  tout en majuscule
function onSetToUppercase(e) {
    let upperCase = e.toUpperCase();
    return upperCase;
};

// detection des champs vides obligatoires
function onCheckEmptyField(e) {
    if (e === "") {
        console.log("Champ vide obligatoire détecté !");
    };
    return e === ""? true :false;
};









// Conversion du format time en seconde
function onConvertTimeToSecond(stringValue) {
    let [hours, minutes, seconds] = stringValue.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};


// Convertion des dates stocké en US vers le format FR

function onFormatDateToFr(dateString) {
    // Créer un objet Date en analysant la chaîne de date
    let date = new Date(dateString);

    // Obtenir les composants de la date
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let annee = date.getFullYear() % 100; // 100% permet d'obtenir les deux derniers digit de l'année

    // Ajouter un zéro devant le jour et le mois si nécessaire
    jour = (jour < 10) ? '0' + jour : jour;
    mois = (mois < 10) ? '0' + mois : mois;

    // Créer la nouvelle chaîne de date au format "dd-mm-yyyy"
    let dateFormatee = jour + '-' + mois + '-' + annee;

    return dateFormatee;
};


// ------------------------- CONDITION D'UTILISATION ---------------------------



let cookiesConditionUtilisation_keyName = "MonSuivitSportif-ConditionAccepted";

function onCheckConditionUtilisation() {
    if (localStorage.getItem(cookiesConditionUtilisation_keyName) === null) {
        localStorage.setItem(cookiesConditionUtilisation_keyName,false);
        console.log(" Creation du cookies : " + cookiesConditionUtilisation_keyName);
    };

    console.log(localStorage.getItem(cookiesConditionUtilisation_keyName));
    if (localStorage.getItem(cookiesConditionUtilisation_keyName) === "false") {
        onGenerateConditionUtilisation();
    };
};



function onGenerateConditionUtilisation() {
    onChangeDisplay(["divHome","divMainBtnMenu"],["divConditionUtilisation"],[],[],["launch-btn"],[]);
    console.log("Génération du popup des conditions d'utilisation");

};

// Acceptation des conditions d'utilisations

function onClickAcceptCondition() {
    localStorage.setItem(cookiesConditionUtilisation_keyName,true);
    console.log("Acceptation des conditions d'utilisation");
    onChangeDisplay(["divConditionUtilisation"],["divHome","divMainBtnMenu"],[],[],[],[]);
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
    currentBaseVersion = 1,
    cookiesBddVersion_KeyName = "Mind2Task-bddVersion";


function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,currentBaseVersion);

    // Traitement selon résultat

   
    // Mise à jour ou création requise
    openRequest.onupgradeneeded = function () {
        console.log(" [ DATABASE] Initialisation de la base de donnée");

        db = openRequest.result;
        if(!db.objectStoreNames.contains(activityStoreName)){
            // si le l'object store n'existe pas
            let activityStore = db.createObjectStore(activityStoreName, {keyPath:'key', autoIncrement: true});
            console.log("[ DATABASE] Creation du magasin " + activityStoreName);

            activityStore.createIndex('date','date',{unique:false});
            activityStore.createIndex('distance','distance',{unique:false});
            activityStore.createIndex('duration','duration',{unique:false});

        };



        // Stoque le numéro de version de base de l'application
        localStorage.setItem(cookiesBddVersion_KeyName, currentBaseVersion.toString());

    };

    openRequest.onerror = function(){
        console.error("Error",openRequest.error);
    };

    openRequest.onsuccess = function(){
        db = openRequest.result
        console.log("[ DATABASE] Base ready");

        // Premiere remplissage de la base avec le formation de trie par défaut
        onUpdateActivityBddList();
    };


};


onStartDataBase();