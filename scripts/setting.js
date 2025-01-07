

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







function onOpenMenuSetting() {

    
};










// Retour depuis Setting
function onClickReturnFromSetting() {


    // ferme le menu
    onLeaveMenu("Setting");
};