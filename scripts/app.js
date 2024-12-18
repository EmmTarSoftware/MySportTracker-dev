

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


function onChangeMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);

    // reference le "p" qui contient le titre du menu pour le changer
    let pMenuTitleRef = document.getElementById("pMenuTitle");


    switch (menuTarget) {
        case "Favoris":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Favoris");
            pMenuTitleRef.innerHTML = "Activités / Favoris";
            onChangeDisplay(allDivHomeToDisplayNone,["divFavoris","divBtnFavoris"],[],[],[],[],[]);
            onOpenMenuFavoris();
        break;
        case "Stat":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Stat");
            pMenuTitleRef.innerHTML = "Statistiques";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnStat"],["divStat"],[],[],[],[]);
            onOpenMenuStat();
        break;
        case "Trophy":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Trophy");
            pMenuTitleRef.innerHTML = "Récompenses";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnTrophy"],["divTrophy"],[],[],[],[]);
            onOpenMenuTrophy();
        break;
        case "NewActivity":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : New Activity");
            pMenuTitleRef.innerHTML = "Créer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],["btnDeleteActivity"],[]);
            onOpenNewActivity();
        break;
        case "EditActivity":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : EditActivity");
            pMenuTitleRef.innerHTML = "Editer une activité";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnActivity"],["divActivityEditor"],[],[],[],["btnDeleteActivity"]);
        break;

        
        // Menu supplémentaire

        case "Profil":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Profil");
            pMenuTitleRef.innerHTML = "Mon profil";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnProfil"],["divProfil"],[],[],[],[]);
            onOpenMenuProfil();
        break;
        case "Setting":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Setting");
            pMenuTitleRef.innerHTML = "Paramètres";
            onChangeDisplay(allDivHomeToDisplayNone,["divBtnSetting"],["divSetting"],[],[],[],[]);
            onOpenMenuSetting();
        break;
        case "Info":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Info");
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
};
function onClickMenuSup(event,target) {
    event.stopPropagation();
    document.getElementById("divMainMenuSup").style.display = "none";

    onChangeMenu(target);
};
function onAnnulMenuSup(){
    console.log("[ NAVIGATION ] Annulation menu supplémentaire");
    onChangeDisplay(["divMainMenuSup"],["btnNewActivity"],[],[],[],[],[]);
};





function onLeaveMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);

    // remet le titre initial du menu
    // reference le "p" qui contient le titre du menu pour le changer
    let pMenuTitleRef = document.getElementById("pMenuTitle");
    pMenuTitleRef.innerHTML = "Mon Suivit Sportif";

    switch (menuTarget) {

        case "Favoris":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Favoris");
            onChangeDisplay(["divFavoris","divBtnFavoris"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Stat":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Stat");
            onChangeDisplay(["divStat","divBtnStat"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Trophy":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Trophy");
            onChangeDisplay(["divTrophy","divBtnTrophy"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Activity":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Activity");
            onChangeDisplay(["divActivityEditor"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],["divActivityEditor","divBtnActivity"],[],[]);
        break;

        // Condition utilisateur

        case "userCondition":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : UserCondition");
            onChangeDisplay(["divConditionUtilisation"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;

        
        //  Menu supplementaire

        case "Profil":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Profil");
            onChangeDisplay(["divProfil","divBtnProfil"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Setting":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Setting");
            onChangeDisplay(["divSetting","divBtnSetting"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;
        case "Info":
            console.log("[ NAVIGATION ] Traitement pour quitter le menu :  : Info");
            onChangeDisplay(["divInfo","divBtnInfo"],allDivHomeToDisplayBlock,allDivHomeToDisplayFlex,[],[],[],[]);
        break;


        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le menu = " + menuTarget);
        break;
    };

};



// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplayBlock,toDisplayFlex,toDisable,toEnable,visibilityOFF,visibilityON) {
    // Cache les items
    toHide.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items en block
    toDisplayBlock.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });

     // Affiche les items en flex
     toDisplayFlex.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "flex";
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
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let year = date.getFullYear();

    // Obtenir l'année actuelle
    let currentYear = new Date().getFullYear();

    // Tableau des noms de mois en français
    const montName = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

    if (year === currentYear) {
        // Si l'année est l'année en cours, retourner le format "day mois"
        return `${day} ${montName[month - 1]}`;
    } else {
        // Sinon, retourner le format "jj-mm-aa"
        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        let year2Digits = year % 100; // Obtenir les deux derniers chiffres de l'année
        return `${day}-${month}-${year2Digits}`;
    }
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
    onChangeDisplay(allDivHomeToDisplayNone,["divConditionUtilisation"],[],[],[],["launch-btn"],[]);
    console.log("Génération du popup des conditions d'utilisation");

};

// Acceptation des conditions d'utilisations

function onClickAcceptCondition() {
    localStorage.setItem(cookiesConditionUtilisation_keyName,true);
    console.log("Acceptation des conditions d'utilisation");

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
    currentBaseVersion = 3,
    cookiesBddVersion_KeyName = "Mind2Task-bddVersion";


function onStartDataBase() {
    let openRequest = indexedDB.open(dbName,currentBaseVersion);

    let isNewProfilRequiered = false;//boolean pour savoir si je créer un nouveau profils ou non

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


        // Creation du store pour le profil

        if (!db.objectStoreNames.contains(profilStoreName)) {
            let profilStore = db.createObjectStore(profilStoreName, {keyPath:'key',autoIncrement: true});
            console.log("[ DATABASE PROFIL] Creation du magasin " + profilStoreName);

            profilStore.createIndex('userName', 'name',{unique:true});
            isNewProfilRequiered = true;
            
            
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


        if (isNewProfilRequiered === true) {
            // Creation d'un profil par defaut dans la base
        console.log("[ DATABASE PROFIL] demande de création du profil par defaut");
        onCreateDefaultProfilInBase(userInfo);

        }else{
            // Lancement des éléments du profil
            onExtractProfilFromDB();
        };
        



        // Premiere remplissage de la base avec le formation de trie par défaut
        onUpdateActivityBddList();
    };


};



//--------------------------------- BOUTON FLOTTANT ---------------------------



const btnNewActivityRef = document.getElementById('btnNewActivity');
let lastScrollTop = 0;
let scrollTimeout;


// Écoute de l'événement scroll sur la div
divItemListRef.addEventListener('scroll', () => {
    // Cache le bouton dès qu'il y a un mouvement de scroll
    btnNewActivityRef.classList.add('hidden');

    // Empêche le bouton de réapparaître immédiatement
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        btnNewActivityRef.classList.remove('hidden');
    }, 200); // Réapparaît après 200ms une fois le scroll arrêté
});





onStartDataBase();