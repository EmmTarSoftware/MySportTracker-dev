

// Boolean de dev pour les logs
let devMode = false,
    cookiesDevModeName = "MSS-devMode";



function onOpenMenuSetting() {
    // Lance le référencement des items
    onReferenceItemsSetting();

    // set les éléments du menu paramètres
    onSetSettingItems();
    
};
    
    
    
    
    





// Vérification de l'engeristrement du cookies DEV MODE en local storage
function onCheckDevModeValueInLocalStorage() {
    console.log("[DEV] vérification de l'existance du cookies devMode ");

    if (localStorage.getItem(cookiesDevModeName) === null){
        localStorage.setItem(cookiesDevModeName, false);
        console.log("[DEV] Creation du cookies :  " + cookiesDevModeName);
    }else{
        console.log("[DEV] cookies existants, changement dans le tableau = ");
        devMode = localStorage.getItem(cookiesDevModeName) === "true";
        console.log("[DEV] Dev mode = " + devMode);
    };

    // Set la checkbox selon la valeur de devMode
    document.getElementById("inputCheckboxDevMode").checked = devMode;

};

onCheckDevModeValueInLocalStorage();


// L'utilisateur change le mode de dev
function onChangeDevModeStatus(mode) {
    console.log("[DEV] changement du dev mode sur : " + mode.checked);
    devMode = mode.checked;

    console.log("[DEV] enregistrement en cookies");
    localStorage.setItem(cookiesDevModeName,devMode);
}



// ------------------------  Paramètre utilisateur -------------------------



let defaultSetting = {
    displayCommentDoneMode : "Collapse",
    displayCommentPlannedMode : "Collapse"
};

let userSetting = {},
    currentCommentDoneClassName = "",
    currentCommentPlannedClassName = "";


    



let selectSettingCommentModePlannedRef,
selectSettingCommentModeDoneRef;



// Referencement
function onReferenceItemsSetting() {
    selectSettingCommentModePlannedRef =  document.getElementById("selectSettingCommentModePlanned");
    selectSettingCommentModeDoneRef = document.getElementById("selectSettingCommentModeDone");
}

function onSetSettingItems() {
    if (devMode === true){console.log("[SETTING] set les éléments du menu Paramètre");};
    selectSettingCommentModePlannedRef.value = userSetting.displayCommentPlannedMode;
    selectSettingCommentModeDoneRef.value = userSetting.displayCommentDoneMode;

};





// Creation des paramètres par défaut
function onCreateDefaultSettingInBase(settingToInsert) {
    let transaction = db.transaction(settingStoreName,"readwrite");
    let store = transaction.objectStore(settingStoreName);

    let insertRequest = store.add(settingToInsert);

    insertRequest.onsuccess = function () {
        if (devMode === true){console.log(" [ DATABASE SETTING] Les paramètres par défaut ont été ajoutés à la base");};
        
    };

    insertRequest.onerror = function(event){
        console.log("[ DATABASE SETTING] Error d'insertion des paramètres par défaut");
        let errorMsg = event.target.error.toString();
        console.log(errorMsg);
        
    };

    transaction.oncomplete = function(){
        if (devMode === true){console.log("[ DATABASE SETTING] default paramètre : transaction insertData complete");};
        // set les paramètres dans userSetting
        onSetSettingFromOpeningAPP(defaultSetting);
    };
};    



// Récupére les paramètres de la base de données
function onExtractSettingFromDB(){
    if (devMode === true){console.log("[ DATABASE SETTING] Récupère les éléments dans la base");};

    let transaction = db.transaction([settingStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(settingStoreName);

    // Rechercher un élément où la key est égal à '1'
    let requestTask = objectStoreTask.get(1);


    // Traitement de la requête
    requestTask.onsuccess = function(event) {
        if (requestTask.result) {
            if (devMode === true){console.log('[ DATABASE SETTING] Élément trouvé : ', requestTask.result);};

            onSetSettingFromOpeningAPP(requestTask.result);

        } else {
            if (devMode === true){console.log('[ DATABASE SETTING] Aucun élément trouvé pour les paramètres');};
        }
    };

    requestTask.onerror = function(event) {
        console.error(' [ DATABASE SETTING] Erreur lors de la récupération de l\'élément', event.target.error);
    };

};



// Set les paramètres venant de la base dans user setting et ensuite lance la liste des items
function onSetSettingFromOpeningAPP(settingExtracted) {
    userSetting = settingExtracted;
    if (devMode === true){
        console.log('[SETTING] Paramètres utilisateur : ');
        console.log(userSetting);
        console.log("[SETTING] Mise à jours des CSS selon le mode d'affichage");
    };

    // Met à jour les css du mode d'affichage selon les paramètres
    currentCommentDoneClassName = onSearchCommentClassNameByMode(userSetting.displayCommentDoneMode);
    currentCommentPlannedClassName = onSearchCommentClassNameByMode(userSetting.displayCommentPlannedMode);



    // Premiere remplissage de la base avec le formation de trie par défaut
    onUpdateActivityBddList(false);
}




// Clique sur save Setting
function onClickSaveFromSetting() {
    // Lancement de sauvegarde des paramètres uniquement si modifié
   // Création d'une liste de champs à comparer
    const fieldsToCompare = [
        { oldValue: userSetting.displayCommentDoneMode, newValue: selectSettingCommentModeDoneRef.value },
        { oldValue: userSetting.displayCommentPlannedMode, newValue: selectSettingCommentModePlannedRef.value },
    ];


    // Vérification si une différence est présente
    // some s'arrete automatiquement si il y a une différence
    const updateDataRequiered = fieldsToCompare.some(field => field.oldValue != field.newValue);

    if (updateDataRequiered) {
        if (devMode) console.log("[SETTING] Informations des paramètres différentes : Lancement de l'enregistrement");
        onSaveUserSetting();
    } else {
        if (devMode) console.log("[SETTING] Aucune modification de paramètre nécessaire !");
        onLeaveMenu("Setting");
    }
};


// Fonction de préparation de sauvegarde des setting dans la bdd
function onSaveUserSetting() {

    // Met tous les éléments des inputs dans la variable userSetting
    userSetting.displayCommentDoneMode = selectSettingCommentModeDoneRef.value;
    userSetting.displayCommentPlannedMode = selectSettingCommentModePlannedRef.value;

    // demande d'actualisation du mode d'affichage selon les paramètres
    onUpdateCSSDisplayMode();

    // Sauvegarde dans la base
    if (devMode === true){
        console.log("[ SETTING ] mise à jour de userSetting");
        console.log( "[ SETTING ] demande de sauvegarde des setting dans la base ");
    };
    onInsertSettingModificationInDB(userSetting);
};




// Fonction de modification du setting dans la base
function onInsertSettingModificationInDB(e) {
    if (devMode === true){console.log("fonction d'insertion des paramères modifiés");};

    let transaction = db.transaction(settingStoreName,"readwrite");
    let store = transaction.objectStore(settingStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(1));

    

    modifyRequest.onsuccess = function () {
        if (devMode === true){console.log("modifyRequest = success");};

        let modifiedData = modifyRequest.result[0];

        modifiedData.displayCommentDoneMode = e.displayCommentDoneMode;
        modifiedData.displayCommentPlannedMode = e.displayCommentPlannedMode;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            if (devMode === true){console.log("[ DATABASE SETTING] insert ModifiedData = success");};

        };

        insertModifiedData.onerror = function (){
            if (devMode === true){console.log("[ DATABASE SETTING] insert ModifiedData = error",insertModifiedData.error); };
        };
    };

    modifyRequest.onerror = function(){
        if (devMode === true){console.log("[ DATABASE SETTING] ModifyRequest = error");};
    };

    transaction.oncomplete = function(){
        if (devMode === true){console.log("[ DATABASE SETTING] Transaction insertion modification setting complété !");};
        // Popup notification
        onShowNotifyPopup(notifyTextArray.saveSetting);
        // ferme le menu
        onLeaveMenu("Setting");
    };
};




function onSearchCommentClassNameByMode(mode) {
    let cssClassTarget = "";
    // Choisit la nouvelle classe
    switch (mode) {
        case "Collapse":
            cssClassTarget = "item-data-comment-collapse";
            break;
        case "Compact":
            cssClassTarget = "item-data-comment-compact";
            break;
        case "Expand":
            cssClassTarget = "item-data-comment-expand";
            break;
    
        default:
            break;
    }

    return cssClassTarget;
}







// Mode d'affichage commentaire
function onUpdateCSSDisplayMode(){
    
    if (devMode === true) {
        console.log("[SETTING] Actualisation des paramètres d'affichages");
    };

    // Set les nouvelles classe CSS
    currentCommentDoneClassName = onSearchCommentClassNameByMode(userSetting.displayCommentDoneMode);
    currentCommentPlannedClassName = onSearchCommentClassNameByMode(userSetting.displayCommentPlannedMode);
    

    // Récupère tous les éléments avec le tag "planifié"
    const activitiesPlannedTargetArray = document.querySelectorAll(`[data-type=planifie]`);

    activitiesPlannedTargetArray.forEach(e=>{
        // utilisation de className pour supprimer toutes les class d'avant
        e.className = currentCommentPlannedClassName;
    });

    // Récupère tous les éléments avec le tag "done"
    const activitiesDoneTargetArray = document.querySelectorAll(`[data-type=effectue]`);

    activitiesDoneTargetArray.forEach(e=>{
        // utilisation de className pour supprimer toutes les class d'avant
        e.className = currentCommentDoneClassName;
    });

    if (devMode === true) {
        console.log("[SETTING] Mise à jour du CSS de la page selon le mode");
    };

}





// Retour depuis Setting
function onClickReturnFromSetting() {


    // ferme le menu
    onLeaveMenu("Setting");
};