
let userTemplateListe = ["M"],
    templateAvailable = false;

// Génère la liste d'activité pour les modèles
onGenerateActivityOptionChoice("selectorTemplateCategoryChoice");

// Reférencement
let imgTemplateEditorPreviewRef = document.getElementById("imgTemplateEditorPreview"),
    pTemplateEditorInfoRef = document.getElementById("pTemplateEditorInfo"),
    selectorTemplateCategoryChoiceRef = document.getElementById("selectorTemplateCategoryChoice"),
    inputTemplateIsPlannedRef = document.getElementById("inputTemplateIsPlanned"),
    inputTemplateDateRef = document.getElementById("inputTemplateDate"),
    inputTemplateLocationRef = document.getElementById("inputTemplateLocation"),
    inputTemplateDistanceRef = document.getElementById("inputTemplateDistance"),
    inputTemplateDurationRef = document.getElementById("inputTemplateDuration"),
    textareaTemplateCommentRef = document.getElementById("textareaTemplateComment");















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


// Ouvre le menu
function onOpenMenuGestTemplate() {
    
}



// Variable pour connaitre dans quel mode l'editeur d'activité est ouvert
let templateEditorMode; //  creation, modification, 




//Clique sur créer un nouveau modèle
function onClickBtnCreateTemplate() {
    templateEditorMode = "creation";
    if (devMode === true){console.log("ouverture de l'editeur de template en mode " + templateEditorMode);};

    // Initialise les éléments
    onResetTemplateInputs();

    pTemplateEditorInfoRef.innerHTML = "📄Modèle d'activité : ";

    onChangeDisplay(["divBtnGestTemplate","divGestTemplate"],["divBtnTemplateEditor"],["divTemplateEditor"],[],[],["btnDeleteTemplate"],[]);



}
















// Reset les inputs du menu activité
function onResetTemplateInputs() {
    if (devMode === true){console.log("reset les inputs du menu template");};
    inputTemplateDateRef.value = "";
    inputTemplateLocationRef.value = "";
    inputTemplateDistanceRef.value = "";
    inputTemplateDurationRef.value = "00:00:00";
    textareaTemplateCommentRef.value = "";
    inputTemplateIsPlannedRef.checked = false;

    // pour le selecteur d'activité, met le premier éléments qui à dans favoris, ou sinon CAP par défaut, C.A.P
    selectorTemplateCategoryChoiceRef.value = userFavoris.length > 0 ? userFavoris[0] : "C.A.P";

    // l'image de prévisualisation 
    imgTemplateEditorPreviewRef.src = userFavoris.length > 0 ? activityChoiceArray[userFavoris[0]].imgRef  : activityChoiceArray["C.A.P"].imgRef;
    pTemplateEditorInfo.innerHTML = "";

    inputTemplateDateRef.classList.remove("fieldRequired");
};







// Quitte le menu
function onClickReturnFromGestTemplate() {
    onLeaveMenu("GestTemplate");
}