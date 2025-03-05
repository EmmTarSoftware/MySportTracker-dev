

// Boolean de dev pour les logs
let devMode = false;


function onOpenMenuSetting() {
    // Lance le référencement des items
    onReferenceItemsSetting();

    // set les éléments du menu paramètres
    onSetSettingItems();
    
};
    
    
    
    

// ------------------------  Paramètres utilisateur -------------------------



let defaultSetting = {
    agenda :"NONE",
    agendaScheduleStart:"08:00",
    agendaScheduleEnd:"10:00",
    displayCommentDoneMode : "Collapse",
    displayCommentPlannedMode : "Collapse",
    isAutoSaveEnabled : false,
    lastAutoSaveDate : "noSet",
    lastAutoSaveTime : "",
    lastManualSaveDate : "noSet",
    lastManualSaveTime :"",
    autoSaveFrequency : 7,
    devMode : false
};

let userSetting = {},
    currentCommentDoneClassName = "",
    currentCommentPlannedClassName = "";


    



let selectSettingCommentModePlannedRef,
    selectSettingCommentModeDoneRef,
    inputSettingIsAutoSaveRef,
    inputSettingSaveFrequencyRef,
    inputCheckboxDevModeRef,
    selectSettingAgendaRef,
    inputTimeSettingScheduleStartRef,
    inputTimeSettingScheduleEndRef;



// Referencement
function onReferenceItemsSetting() {
    selectSettingCommentModePlannedRef =  document.getElementById("selectSettingCommentModePlanned");
    selectSettingCommentModeDoneRef = document.getElementById("selectSettingCommentModeDone");
    inputSettingIsAutoSaveRef = document.getElementById("inputSettingIsAutoSave");
    inputSettingSaveFrequencyRef = document.getElementById("inputSettingSaveFrequency");
    inputCheckboxDevModeRef = document.getElementById("inputCheckboxDevMode");
    selectSettingAgendaRef = document.getElementById("selectSettingAgenda");
    inputTimeSettingScheduleStartRef = document.getElementById("inputTimeSettingScheduleStart");
    inputTimeSettingScheduleEndRef = document.getElementById("inputTimeSettingScheduleEnd");
}

function onSetSettingItems() {
    if (devMode === true){console.log("[SETTING] set les éléments du menu Paramètre");};
    selectSettingCommentModePlannedRef.value = userSetting.displayCommentPlannedMode;
    selectSettingCommentModeDoneRef.value = userSetting.displayCommentDoneMode;
    inputSettingIsAutoSaveRef.checked = userSetting.isAutoSaveEnabled;
    inputSettingSaveFrequencyRef.value = userSetting.autoSaveFrequency;
    inputCheckboxDevModeRef.checked = userSetting.devMode;
    selectSettingAgendaRef.value = userSetting.agenda;
    inputTimeSettingScheduleStartRef.value = userSetting.agendaScheduleStart;
    inputTimeSettingScheduleEndRef.value = userSetting.agendaScheduleEnd;

     // Set la date de la dernière sauvegarde auto
     document.getElementById("pSettingLastAutoSaveDate").innerHTML = userSetting.lastAutoSaveDate === "noSet" ? "Date Indisponible." : `Le ${onFormatDateToFr(userSetting.lastAutoSaveDate)} à ${userSetting.lastAutoSaveTime}`;
    
};



// Clique sur save Setting
function onClickSaveFromSetting() {
    onLockDivDoubleClick(["divBtnSetting","divSetting"]);//Sécurité clic

    // controle champ obligatoire pour sauvegarde automatique si activé
    if (devMode === true){console.log("[SETTING] controle des champs requis");};
    let emptyFieldSaveFrequency = onCheckEmptyField(inputSettingSaveFrequencyRef.value);
    
    if (inputSettingIsAutoSaveRef.checked === true && emptyFieldSaveFrequency === true) {
        if (devMode === true){console.log("[SETTING] Champ obligatoire 'frequence save' non remplis");};
    
        inputSettingSaveFrequencyRef.classList.add("fieldRequired");
        onUnlockDivDoubleClick(["divBtnSetting","divSetting"]);//Sécurité clic retirée
        return
    };
    

    // Lancement de sauvegarde des paramètres uniquement si modifié
   // Création d'une liste de champs à comparer
    const fieldsToCompare = [
        { oldValue: userSetting.displayCommentDoneMode, newValue: selectSettingCommentModeDoneRef.value },
        { oldValue: userSetting.displayCommentPlannedMode, newValue: selectSettingCommentModePlannedRef.value },
        { oldValue: userSetting.isAutoSaveEnabled, newValue: inputSettingIsAutoSaveRef.checked },
        { oldValue: userSetting.autoSaveFrequency, newValue: inputSettingSaveFrequencyRef.value },
        { oldValue: userSetting.devMode, newValue: inputCheckboxDevModeRef.checked },
        { oldValue: userSetting.agenda, newValue: selectSettingAgendaRef.value},
        { oldValue: userSetting.agendaScheduleStart,  newValue: inputTimeSettingScheduleStartRef.value},
        { oldValue: userSetting.agendaScheduleEnd, newValue: inputTimeSettingScheduleEndRef.value}
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
    userSetting.isAutoSaveEnabled = inputSettingIsAutoSaveRef.checked;
    userSetting.autoSaveFrequency = inputSettingSaveFrequencyRef.value;
    userSetting.devMode = inputCheckboxDevModeRef.checked;
    userSetting.agenda = selectSettingAgendaRef.value;
    userSetting.agendaScheduleStart = inputTimeSettingScheduleStartRef.value;
    userSetting.agendaScheduleEnd = inputTimeSettingScheduleEndRef.value;


    // Met a jour le boolean devMode
    devMode = userSetting.devMode;

    // demande d'actualisation du mode d'affichage selon les paramètres
    onUpdateCSSDisplayMode();

    // Sauvegarde dans la base
    if (devMode === true){
        console.log("[SETTING] mise à jour de userSetting");
        console.log( "[SETTING] demande de sauvegarde des setting dans la base ");
    };
    eventSaveSetting(userSetting);
};


// Sequence de sauvegarde des paramètres
async function eventSaveSetting(newSetting){


    await onInsertSettingModificationInDB(newSetting);
    // Popup notification
    onShowNotifyPopup(notifyTextArray.saveSetting);
    // ferme le menu
    onLeaveMenu("Setting");
}



// Modification Setting
async function onInsertSettingModificationInDB(settingToUpdate) {

    try {
        // Récupérer l'élément actuel depuis la base
        let existingDoc = await db.get(settingStoreName);

        // Mettre à jour les champs nécessaires en conservant `_id` et `_rev`
        const updatedDoc = {
            ...existingDoc,  // Garde _id et _rev pour la mise à jour
            ...settingToUpdate // Remplace les valeurs avec les nouvelles
        };

        // Enregistrer les modifications dans la base
        await db.put(updatedDoc);

        if (devMode === true ) {console.log("[SETTING] Paramètres mis à jour :", updatedDoc);};

        return updatedDoc; // Retourne l'objet mis à jour
    } catch (err) {
        console.error("[SETTING] Erreur lors de la mise à jour des paramètres :", err);
    }
}





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


// enleve l'alerte l'input de frequence d'activité si un changement est constaté
function onDataInSettingSaveFrequencyChange(){
    if (inputSettingSaveFrequencyRef.classList.contains("fieldRequired")) {
        inputSettingSaveFrequencyRef.classList.remove("fieldRequired");
    }

}





// Fonction pour empécher les conflits d'heure de début et de fin pour l'agenda
function onCheckAgendaNotifyTime() {

    // Si l'heure de fin est avant l'heure de début, on la met à jour
    if (inputTimeSettingScheduleEndRef.value < inputTimeSettingScheduleStartRef.value) {
        inputTimeSettingScheduleEndRef.value = inputTimeSettingScheduleStartRef.value;
    }

    // empêche de choisir une heure de fin antérieure à l'heure de début
    inputTimeSettingScheduleEndRef.min = inputTimeSettingScheduleStartRef.value;
}


function onCheckEndSchedule() {

    // Si l'heure de fin est avant l'heure de début, on la met à jour
    if (inputTimeSettingScheduleEndRef.value < inputTimeSettingScheduleStartRef.value) {
        inputTimeSettingScheduleEndRef.value = inputTimeSettingScheduleStartRef.value;
    }

}






function onResetSettingItems() {
    // Retire la class css field required au cas ou pour l'input saveFrequency
    inputSettingSaveFrequencyRef.classList.remove("fieldRequired");
}



// Retour depuis Setting
function onClickReturnFromSetting() {
    onResetSettingItems();

    // ferme le menu
    onLeaveMenu("Setting");
};