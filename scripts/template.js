
let userTemplateListe = ["M"],
    templateAvailable = false;


// Actualise la liste des modele et gere les boutons selons

function onUpdateModelList() {

    templateAvailable = userTemplateListe.length > 0;

    if (devMode === true){
        console.log("[TEMPLATE] Actualisation de la liste des modèles");
        console.log("[TEMPLATE] Nombre de modele : " + userTemplateListe.length);
    };

    // Gere l'affichage du bouton "new from template" selon
    document.getElementById("btnNewFromTemplate").style.display = templateAvailable ? "block" : "none";


    // Ajout ou non le bouton dans l'array de gestion générale des éléments "home"
    if (templateAvailable && !allDivHomeToDisplayNone.includes("btnNewFromTemplate")) {
        // Ajout le bouton modele aux array de gestion Home
        allDivHomeToDisplayNone.push("btnNewFromTemplate");
        allDivHomeToDisplayBlock.push("btnNewFromTemplate");

        if (devMode === true){console.log("[TEMPLATE] Ajout du bouton aux listes de gestion");};

    } else if (!templateAvailable && allDivHomeToDisplayNone.includes("btnNewFromTemplate")) {
        // Recupère l'index et retire le bouton dans la gestion HOME
        let indexToRemove = allDivHomeToDisplayNone.indexOf("btnNewFromTemplate");
        allDivHomeToDisplayNone.splice(indexToRemove,1);

        indexToRemove = allDivHomeToDisplayBlock.indexOf("btnNewFromTemplate");
        allDivHomeToDisplayBlock.splice(indexToRemove,1);

        if (devMode === true){console.log("[TEMPLATE] Retire le bouton aux listes de gestion");};

    }
    
}
