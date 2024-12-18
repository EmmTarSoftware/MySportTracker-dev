

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









function onOpenMenuSetting() {

    
};










// Retour depuis Setting
function onClickReturnFromSetting() {


    // ferme le menu
    onLeaveMenu("Setting");
};