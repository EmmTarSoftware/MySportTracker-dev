
let userTemplateListe = ["M"],
    templateAvailable = false;

// Génère la liste d'activité pour les modèles
onGenerateActivityOptionChoice("selectorTemplateCategoryChoice");

// Reférencement
let imgTemplateEditorPreviewRef = document.getElementById("imgTemplateEditorPreview"),
    pTemplateEditorInfoRef = document.getElementById("pTemplateEditorInfo"),
    selectorTemplateCategoryChoiceRef = document.getElementById("selectorTemplateCategoryChoice"),
    inputTemplateIsPlannedRef = document.getElementById("inputTemplateIsPlanned"),
    inputTemplateTitleRef = document.getElementById("inputTemplateTitle"),
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






// Quitte le menu
function onClickReturnFromGestTemplate() {
    onLeaveMenu("GestTemplate");
}







// ---------------------------- TEMPLATE EDITEUR - -------------------------------




// Variable pour connaitre dans quel mode l'editeur d'activité est ouvert
let templateEditorMode; //  creation, modification, 

// Format de l'objet pour une nouvelle activité
let templateToInsertFormat = {
    title :"",
    name :"",
    location : "",
    distance : "",
    duration : "",
    comment : "",
    isPlanned : false
};



//Clique sur créer un nouveau modèle
function onClickBtnCreateTemplate() {
    templateEditorMode = "creation";
    if (devMode === true){console.log("ouverture de l'editeur de template en mode " + templateEditorMode);};

    // Initialise les éléments
    onResetTemplateInputs();

    
}




// Set l'image de prévisualisation d'activité dans l'éditeur
function onChangeTemplatePreview(dataName) {
    if (devMode === true){console.log(dataName);};
    imgTemplateEditorPreviewRef.src = activityChoiceArray[dataName].imgRef;
} 

// Set l'icone "temporaire" dans la prévisualisation
function onChangeTemplatePlanned(checkBoxValue) {
    pTemplateEditorInfoRef.innerHTML = checkBoxValue ? " 📄Modèle d'activité planifiée :🗓️ ":"📄Modèle d'activité : ";
}




// retrait de l'indication de champ obligatoire si activé, lorsque l'utilisateur
//  modifie quelque chose dans le champ Titre
function onInputTemplateTitleChange() {

    if (inputTemplateTitleRef.classList.contains("fieldRequired")) {
        inputTemplateTitleRef.classList.remove("fieldRequired");
    }
    
}



function onClickSaveFromTemplateEditor(){
    // Lancement du formatage du modèle
    onFormatTemplate();
}







function onFormatTemplate() {


    if (templateEditorMode === "creation") {
        if (devMode === true){console.log("[TEMPLATE] Demande de création d'un nouveau modèle");};
    }else if(templateEditorMode === "modification"){
        if (devMode === true){console.log("[TEMPLATE] Demande d'enregistrement d'une modification de modèle");};
    };
    



    // Verification des champs requis
    if (devMode === true){console.log("[TEMPLATE] controle des champs requis");};
    let emptyField = onCheckEmptyField(inputTemplateTitleRef.value);

    if (emptyField === true) {
        if (devMode === true){console.log("[TEMPLATE] Champ obligatoire non remplis");};

        inputTemplateTitleRef.classList.add("fieldRequired");
        return
    };


    //  met tous les éléments dans l'objet

    templateToInsertFormat.name = selectorTemplateCategoryChoiceRef.value;
    templateToInsertFormat.title =inputTemplateTitleRef.value;
    templateToInsertFormat.distance = inputTemplateDistanceRef.value;
    templateToInsertFormat.location = onSetToUppercase(inputTemplateLocationRef.value);
    templateToInsertFormat.comment = textareaTemplateCommentRef.value;
    templateToInsertFormat.duration = inputTemplateDurationRef.value;
    templateToInsertFormat.isPlanned = inputTemplateIsPlannedRef.checked;

    // Demande d'insertion dans la base soit en creation ou en modification

    if (templateEditorMode === "creation") {
        onInsertNewTemplate(templateToInsertFormat);
    }else if(templateEditorMode === "modification"){
        onCheckIfTemplateModifiedRequired(templateToInsertFormat);
    };

}






// Insertion d'un nouveau modèle

function onInsertNewTemplate(dataToInsert) {
    let transaction = db.transaction(templateStoreName,"readwrite");
    let store = transaction.objectStore(templateStoreName);

    let insertRequest = store.add(dataToInsert);

    insertRequest.onsuccess = function () {
        if (devMode === true){console.log(" [ DATABASE ] " + dataToInsert.name + "a été ajouté à la base");};

    };

    insertRequest.onerror = function(event){
        console.log(" [ DATABASE ] Error d'insertion d'un modèle");
        let errorMsg = event.target.error.toString();
       console.log(errorMsg);
        
    };

    transaction.oncomplete = function(){
        console.log("[ DATABASE ] transaction insertData complete");


        // Remet à jour les éléments


        // Popup notification
        onShowNotifyPopup(notifyTextArray.templateCreation);

        //Gestion de l'affichage 
        onLeaveMenu("TemplateEditor");
    };
};







// Retour depuis l'editeur de template
function onClickReturnFromTemplateEditor(){
    onLeaveMenu("TemplateEditor");
}









// Reset les inputs du menu activité
function onResetTemplateInputs() {
    if (devMode === true){console.log("reset les inputs du menu template");};
    inputTemplateTitleRef.value = "";
    inputTemplateLocationRef.value = "";
    inputTemplateDistanceRef.value = "";
    inputTemplateDurationRef.value = "00:00:00";
    textareaTemplateCommentRef.value = "";
    inputTemplateIsPlannedRef.checked = false;

    // pour le selecteur d'activité, met le premier éléments qui à dans favoris, ou sinon CAP par défaut, C.A.P
    selectorTemplateCategoryChoiceRef.value = userFavoris.length > 0 ? userFavoris[0] : "C.A.P";

    // l'image de prévisualisation 
    imgTemplateEditorPreviewRef.src = userFavoris.length > 0 ? activityChoiceArray[userFavoris[0]].imgRef  : activityChoiceArray["C.A.P"].imgRef;
    pTemplateEditorInfoRef.innerHTML = "📄Modèle d'activité : ";

    inputTemplateTitleRef.classList.remove("fieldRequired");
};





