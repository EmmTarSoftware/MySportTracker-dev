

// Boolean de dev pour les logs
let devMode = false,
    cookiesDevModeName = "MSS-devMode";


// Vérification de l'engeristrement du cookies en local storage
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





// -----------------------------------------------  Suppression des données de la base ----------------------------






// Demande de suppression
function onClickDeleteDataBaseFromSetting() {
    if (devMode === true) {console.log("Demande de suppression des données de la base");};

    document.getElementById("divConfirmDeleteDataBase").classList.add("show");

    onChangeDisplay([],[],[],["divSetting","divBtnSetting"],[],[],[]);
}

function onConfirmDeleteDataBase(event) {
    
    event.stopPropagation();
    if (devMode === true) {console.log("Confirmation de la demande de suppression des données");};

    document.getElementById("divConfirmDeleteDataBase").classList.remove("show");
    onChangeDisplay([],[],[],[],["divSetting","divBtnSetting"],[],[]);
    onDeleteBDD();
}


function onCancelDeleteDataBase(params) {
    if (devMode === true) {console.log("annulation de la demande de suppression des données");};

    document.getElementById("divConfirmDeleteDataBase").classList.remove("show");
    onChangeDisplay([],[],[],[],["divSetting","divBtnSetting"],[],[]);
}





// Fonction de suppression de la base et des favoris
function onDeleteBDD() {
   
    if (devMode === true) {console.log("Lancement de la suppression");};
    // Les cookies 
    localStorage.removeItem(cookiesUserFavorisName);
    localStorage.removeItem(cookiesConditionUtilisation_keyName);
    localStorage.removeItem(cookiesDevModeName);

    // La base de donnée
    let requestDelete = indexedDB.deleteDatabase(dbName);


    document.getElementById("pResultDeleteBdD").innerHTML = "Base de donnée supprimée ! Veuillez relancer l'application.";

    // Masque le bouton de retour pour obliger l'utilisateur à relancer ou fermer l'application et desactive les boutons d'import/export
    document.getElementById("divBtnSetting").style.display = "none";
    document.getElementById("btnExportBdD").style.display = "none";
    document.getElementById("btnImportBdD").style.display = "none";
};








// ------------------------  Paramètre utilisateur -------------------------
let userSetting = {
        commentPlannedMode : "Collapse",
        commentDoneMode : "Collapse"
    },
    cookiesSettingCommentPlannedMode_Name = "MSS_comment-planned-mode",
    cookiesSettingCommentDoneMode_Name = "MSS_comment-done-mode",
    currentCommentDoneClassName = "",
    currentCommentPlannedClassName = "";




function onCheckSettingCookies() {

    if (devMode === true) {console.log("Traitement des cookies SETTING")};

    // comment activité planifié
    if (localStorage.getItem(cookiesSettingCommentPlannedMode_Name) === null){
        localStorage.setItem(cookiesSettingCommentPlannedMode_Name, userSetting.commentPlannedMode);
        if (devMode === true) {console.log("[SETTING] Creation du cookies :  " + cookiesSettingCommentPlannedMode_Name);};
    }else{
        if (devMode === true) {console.log("[SETTING] cookies existants, chargement dans la variable userSetting");};
        userSetting.commentPlannedMode = localStorage.getItem(cookiesSettingCommentPlannedMode_Name);
    };

    //comment activité effectué
    if (localStorage.getItem(cookiesSettingCommentDoneMode_Name) === null){
        localStorage.setItem(cookiesSettingCommentDoneMode_Name, userSetting.commentDoneMode);
        if (devMode === true) {console.log("[SETTING] Creation du cookies : " + cookiesSettingCommentDoneMode_Name);};
    }else{
        if (devMode === true) {console.log("[SETTING] cookies existants, chargement dans la variable userSetting");};
        userSetting.commentDoneMode = localStorage.getItem(cookiesSettingCommentDoneMode_Name);
    };

    // set les valeur dans le menu paramètres :
    document.getElementById("selectSettingCommentModePlanned").value = userSetting.commentPlannedMode;
    document.getElementById("selectSettingCommentModeDone").value = userSetting.commentDoneMode;

    // set les class selon les paramètres
    currentCommentDoneClassName = onSearchCommentClassNameByMode(userSetting.commentDoneMode);
    currentCommentPlannedClassName = onSearchCommentClassNameByMode(userSetting.commentPlannedMode);

    if (devMode === true) {
        console.log("[SETTING] valeur userSetting =");
        console.log(userSetting);
    };
}

onCheckSettingCookies();





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
function onChangeSettingCommentActivity(newSetting,tag,categoryTarget) {
    
    if (devMode === true) {
        console.log("[SETTING] changement paramètre pour : " + categoryTarget + " - new Value : " + newSetting);
    };


    // enregistre les nouvelles valeur dans userSetting puis dans les cookies
    if (categoryTarget === "done") {
        userSetting.commentDoneMode = newSetting;
        localStorage.setItem(cookiesSettingCommentDoneMode_Name, userSetting.commentDoneMode);
        currentCommentDoneClassName = onSearchCommentClassNameByMode(newSetting);
    } else{
        userSetting.commentPlannedMode = newSetting;
        localStorage.setItem(cookiesSettingCommentPlannedMode_Name, userSetting.commentPlannedMode);
        currentCommentPlannedClassName = onSearchCommentClassNameByMode(newSetting);
    }
    
    // Actualisation en direct
    let cssClassTarget = onSearchCommentClassNameByMode(newSetting);

    // Récupère tous les éléments avec le tag "planifié"
    const activitiesTargetArray = document.querySelectorAll(`[data-type=${tag}]`);

    activitiesTargetArray.forEach(e=>{
        // utilisation de className pour supprimer toutes les class d'avant
        e.className = cssClassTarget;
    });

    if (devMode === true) {
        console.log("[SETTING] Mise à jour de la page");
    };

}








function onOpenMenuSetting() {

    
};










// Retour depuis Setting
function onClickReturnFromSetting() {


    // ferme le menu
    onLeaveMenu("Setting");
};