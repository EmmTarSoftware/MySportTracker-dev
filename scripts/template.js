
let userTemplateList = [{activityName:"",title:"",key:""}],
    templateAvailable = false,
    currentTemplateInView = {},
    maxTemplate = 30;




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






// actualisation de la liste d'activité

function onUpdateTemplateBddList(updateMenuListRequired) {

    if (devMode === true){console.log("[TEMPLATE] Actualisation de la liste des modèles");};


    // recupere les éléments dans la base et les stock dans un tableau temporaire
    
    let transaction = db.transaction([templateStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(templateStoreName);
    let indexStoreTask = objectStoreTask.index("activityName");//Filtre par défaut sur l'index des types d'activité
    let requestTask = indexStoreTask.getAll();


    requestTask.onsuccess = function (){
        if (devMode === true){console.log("[DATABASE] [TEMPLATE] Les éléments ont été récupéré dans la base");};
    };

    requestTask.error = function (){
       console.log("[DATABASE] [TEMPLATE] Erreur de requete sur la base");
    };


    transaction.oncomplete = function (){
        // Récupère uniquement le titre et la key des modèle
        if (devMode === true){console.log(" [DATABASE] [TEMPLATE] Demande d'extraction uniquement pour title and key");};
        onExtractTemplateKeyAndTitle(requestTask.result,updateMenuListRequired);
    };
};



// Récupère uniquement le titre et la key des modèle
function onExtractTemplateKeyAndTitle(data,updateMenuListRequired) {
    //Reset
    userTemplateList = [];

    //Insertion
    data.forEach(templateItem => {
        let itemToInsert = {activityName: templateItem.activityName, title : templateItem.title , key : templateItem.key};
        userTemplateList.push(itemToInsert);
    });


    // trie sur type d'activité puis par alphabétique
    userTemplateList.sort((a, b) => {
        if (a.activityName < b.activityName) return -1;
        if (a.activityName > b.activityName) return 1;
      
        // Si activityName est identique, on trie par title
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
      
        return 0;
    });


    if (devMode === true){
        console.log("[TEMPLATE] Demande d'extraction title and Key effectuée");
        console.log(userTemplateList);
        console.log("[TEMPLATE] Demande d'actualisation de l'affichage");
    };




    //gère l'affichage du bouton de création new template selon si le max atteind
    document.getElementById("btnCreateTemplate").disabled = userTemplateList.length >= maxTemplate ? true : false;


    onUpdateTemplateList(updateMenuListRequired);
        
}




// Actualise la liste des modele et gere les boutons selons
function onUpdateTemplateList(updateMenuListRequired) {

    templateAvailable = userTemplateList.length > 0;

    if (devMode === true){
        console.log("[TEMPLATE] Actualisation de la liste des modèles");
        console.log("[TEMPLATE] Nombre de modele : " + userTemplateList.length);
    };

    if (updateMenuListRequired) {
        if (devMode === true){
            console.log("[TEMPLATE] pour l'instant n'affiche pas le bouton 'new from template'");
            console.log("[TEMPLATE] Car je suis dans le menu 'template'");
        } 
    }else{
        // Gere l'affichage du bouton "new from template" selon
        document.getElementById("btnNewFromTemplate").style.display = templateAvailable ? "block" : "none";
}



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
    


    // Actualise la liste des template dans le menu template si nécessaire
    if (updateMenuListRequired) {
        if (devMode === true){console.log("[TEMPLATE] Recré la liste de template");};
        onCreateTemplateMenuList(userTemplateList);
    }
}


// Ouvre le menu
function onOpenMenuGestTemplate() {

    // Génération de la liste des modèles
    onCreateTemplateMenuList(userTemplateList);


    
    // Génère la liste d'activité pour les modèles
    onGenerateActivityOptionChoice("selectorTemplateCategoryChoice");
    onGenerateFakeOptionList("divFakeSelectOptList");

}









// Génération de la liste des modèle de le menu modèle
function onCreateTemplateMenuList(templateList) {
    if (devMode === true){console.log(" [TEMPLATE] génération de la liste");};

    let divTemplateListMenuRef = document.getElementById("divTemplateListMenu");
    // Reset
    divTemplateListMenuRef.innerHTML = "";


    // Affichage en cas d'aucune modèle
    if (templateList.length < 1) {
        divTemplateListMenuRef.innerHTML = "Aucun modèle à afficher !";
        return
    }


    // Génère la liste
    templateList.forEach((e,index)=>{

        // Creation
        let newContainer = document.createElement("div");
        newContainer.classList.add("item-template-container");
        newContainer.onclick = function (){
            onClicOnTemplateInTemplateMenu(e.key); 
        }

        let newImg = document.createElement("img");
        newImg.classList.add("templateList");
        newImg.src = activityChoiceArray[e.activityName].imgRef;

        let newTitle = document.createElement("span");
        newTitle.innerHTML = e.title;
        newTitle.classList.add("templateList","gestion");

        // Image "setting"
        let newImgSet = document.createElement("img");
        newImgSet.classList.add("templateListSet");
        newImgSet.src = "./Icons/Icon-Set-Template.webp";


        // Insertion

        newContainer.appendChild(newImg);
        newContainer.appendChild(newTitle);
        newContainer.appendChild(newImgSet);

        divTemplateListMenuRef.appendChild(newContainer);


        // Creation de la ligne de fin pour le dernier index
        if (index === (userTemplateList.length - 1)) {
            let newClotureList = document.createElement("span");
            newClotureList.classList.add("last-container");
            newClotureList.innerHTML = "ℹ️ Créez jusqu'à 30 modèles d'activités.";
            divTemplateListMenuRef.appendChild(newClotureList);
        }
    });
}







// ------------------- MODIFICATION de modèle --------------------------------






// Lorsque je clique sur un modèle pour le modifier
function onClicOnTemplateInTemplateMenu(keyRef) {
    onResetTemplateInputs();

    templateEditorMode = "modification";

    // Recherche du modèle à afficher
    onSearchTemplateToDisplay(keyRef,false);

}

// Fonction de recherche d'une activité à afficher depuis la bdd.
function onSearchTemplateToDisplay(keyRef,isForNewActivity) {
    if (devMode === true){
        console.log("[TEMPLATE] Affichage du modèle extrait dans la BdD avec la key :  " + keyRef);
        let text = isForNewActivity ? "[TEMPLATE] recherche pour créer une nouvelle activité" : "[TEMPLATE] recherche pour modification de modele";
        console.log(text);
    };
    

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    if (devMode === true){console.log("[TEMPLATE] lecture de la Base de Données");};
    let transaction = db.transaction(templateStoreName);//readonly
    let objectStore = transaction.objectStore(templateStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        if (devMode === true){
            console.log("[DATABASE][TEMPLATE]Requete de recherche réussit");
            console.log(request.result);
        };


        // Affiche la note voulue
        let tempResult = request.result;
        if (devMode === true){console.log(tempResult[0]);};

        if (isForNewActivity) {
            onOpenNewActivityFromTemplate(tempResult[0]);
        }else{
            onSetTemplateItems(tempResult[0]);
        }


    };

    request.onerror = function (){
        console.log("[DATABASE][TEMPLATE]Requete de recherche erreur");
    };

};



// Remplit l'editeur de template avec les éléments du template extrait de la base
function onSetTemplateItems(templateItem) {


    if (devMode === true){console.log("[TEMPLATE] Set l'editeur de modèle avec les éléments extrait de la base");};

    inputTemplateTitleRef.value = templateItem.title;
    inputTemplateLocationRef.value = templateItem.location;
    inputTemplateDistanceRef.value = templateItem.distance;
    inputTemplateDurationRef.value = templateItem.duration;
    textareaTemplateCommentRef.value = templateItem.comment;
    inputTemplateIsPlannedRef.checked = templateItem.isPlanned;


    // pour le selecteur d'activité, met le premier éléments qui à dans favoris, ou sinon CAP par défaut, C.A.P
    selectorTemplateCategoryChoiceRef.value = templateItem.activityName;

    // l'image de prévisualisation 
    imgTemplateEditorPreviewRef.src = activityChoiceArray[templateItem.activityName].imgRef;
    pTemplateEditorInfoRef.innerHTML = templateItem.isPlanned ? "📄Modèle d'activité.  🗓️Planifiée :":"📄Modèle d'activité : ";


    //met les éléments du modèle dans une variable pour comparer les modifications par la suite
    currentTemplateInView = templateItem;

    onChangeMenu("ModifyTemplate");
}















// ---------------------------- TEMPLATE EDITEUR - -------------------------------




// Variable pour connaitre dans quel mode l'editeur d'activité est ouvert
let templateEditorMode; //  creation, modification, 

// Format de l'objet pour une nouvelle activité
let templateToInsertFormat = {
    title :"",
    activityName :"",
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
function onChangeTemplatePreview(activityName) {
    if (devMode === true){console.log(activityName);};
    imgTemplateEditorPreviewRef.src = activityChoiceArray[activityName].imgRef;
} 

// Set l'icone "temporaire" dans la prévisualisation
function onChangeTemplatePlanned(checkBoxValue) {
    pTemplateEditorInfoRef.innerHTML = checkBoxValue ? " 📄Modèle d'activité.  🗓️Planifiée ":"📄Modèle d'activité : ";
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

    templateToInsertFormat.activityName = selectorTemplateCategoryChoiceRef.value;
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


// Sauvegarde uniquement si une modification a bien été effectuée dans les données
function onCheckIfTemplateModifiedRequired(templateToInsertFormat) {
    
    // Création d'une liste de champs à comparer
    const fieldsToCompare = [
        { oldValue: currentTemplateInView.title, newValue:  templateToInsertFormat.title },
        { oldValue: currentTemplateInView.activityName, newValue: templateToInsertFormat.activityName },
        { oldValue: currentTemplateInView.distance, newValue: templateToInsertFormat.distance },
        { oldValue: currentTemplateInView.location, newValue: templateToInsertFormat.location },
        { oldValue: currentTemplateInView.comment, newValue:  templateToInsertFormat.comment },
        { oldValue: currentTemplateInView.duration, newValue:  templateToInsertFormat.duration },
        { oldValue: currentTemplateInView.isPlanned, newValue:  templateToInsertFormat.isPlanned }
    ];

    if (devMode) {
        fieldsToCompare.forEach(e=>{
            console.log(e);
        });
    };

    // Vérification si une différence est présente
    // some s'arrete automatiquement si il y a une différence
    // Vérification si une différence est présente
    const updateDataRequiered = fieldsToCompare.some(field => {
        if (typeof field.oldValue === "object" && field.oldValue !== null) {
            // Utiliser JSON.stringify pour comparer les contenus des objets
            return JSON.stringify(field.oldValue) !== JSON.stringify(field.newValue);
        }
        // Comparaison simple pour les types primitifs
        return field.oldValue != field.newValue;
    });


    if (updateDataRequiered) {
        if (devMode) console.log("[TEMPLATE] Informations d'activité différentes : Lancement de l'enregistrement en BdD");
        onInsertTemplateModification(templateToInsertFormat);
    } else {
        if (devMode) console.log("[TEMPLATE] Aucune modification de modèle nécessaire !");
         //Gestion de l'affichage 
        onLeaveMenu("TemplateEditor");
    }

}


// Insertion d'une modification d'une activité
function onInsertTemplateModification(e) {
    if (devMode === true){console.log("[TEMPLATE] fonction d'insertion de la donnée modifié");};

    let transaction = db.transaction(templateStoreName,"readwrite");
    let store = transaction.objectStore(templateStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentTemplateInView.key));

    

    modifyRequest.onsuccess = function () {
        console.log("[TEMPLATE]modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.title = e.title;
        modifiedData.activityName = e.activityName;
        modifiedData.distance = e.distance;
        modifiedData.location = e.location;
        modifiedData.comment = e.comment;
        modifiedData.duration = e.duration;
        modifiedData.isPlanned = e.isPlanned;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            if (devMode === true){console.log("[DATABASE][TEMPLATE]insertModifiedData = success");};


        };

        insertModifiedData.onerror = function (){
           console.log("[DATABASE][TEMPLATE] insertModifiedData = error",insertModifiedData.error);

            
        };


    };

    modifyRequest.onerror = function(){
        console.log("[DATABASE][TEMPLATE] ModifyRequest = error");
    };

    transaction.oncomplete = function(){
        if (devMode === true){console.log("[DATABASE][TEMPLATE] transaction complete");};
        
        // Popup notification
        onShowNotifyPopup(notifyTextArray.templateModification);
        
        // Remet à jour les éléments
        //extraction des modèles de la base
        onUpdateTemplateBddList(true);

        //Gestion de l'affichage 
        onLeaveMenu("TemplateEditor");

    };
};




// Insertion d'un nouveau modèle

function onInsertNewTemplate(dataToInsert) {
    let transaction = db.transaction(templateStoreName,"readwrite");
    let store = transaction.objectStore(templateStoreName);

    let insertRequest = store.add(dataToInsert);

    insertRequest.onsuccess = function () {
        if (devMode === true){console.log(" [DATABASE] [TEMPLATE]" + dataToInsert.title + "a été ajouté à la base");};

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

        // Remet à jour les éléments
        //extraction des modèles de la base
        onUpdateTemplateBddList(true);


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


// --------------------- SUPPRESSION TEMPLATE --------------------------


// Suppression d'activité
function onClickDeleteFromTemplateEditor() {
    
    if (devMode === true){console.log("[TEMPLATE]demande de suppression template ");};

    // L'affiche de la div doit se faire en "flex" donc je n'utilise pas le onChangeDisplay
    document.getElementById("divConfirmDeleteTemplate").classList.add("show");

    onChangeDisplay([],[],[],["divTemplateEditor","divBtnTemplateEditor"],[],[],[]);
};


function onConfirmDeleteTemplate(event){

    event.stopPropagation();// Empêche la propagation du clic vers la div d'annulation
    if (devMode === true){console.log("[TEMPLATE] Confirmation de suppression de template ");};
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteTemplate").classList.remove("show");
    onChangeDisplay([],[],[],[],["divTemplateEditor","divBtnTemplateEditor"],[],[]);
    onDeleteTemplate(currentTemplateInView.key);
};


function onAnnulDeleteTemplate(event) {
    
    if (devMode === true){console.log("[TEMPLATE] annulation de la suppression de template ");};
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteTemplate").classList.remove("show");
    onChangeDisplay([],[],[],[],["divTemplateEditor","divBtnTemplateEditor"],[],[]);

};




function onDeleteTemplate(keyTarget) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    if (devMode === true){console.log("Suppression de l'activité avec la key : " + keyTarget);};
    let transaction = db.transaction(templateStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(templateStoreName);
    let request = objectStore.delete(IDBKeyRange.only(keyTarget));
    
    
    request.onsuccess = function (){
        console.log("[DATABASE] [TEMPLATE]Requete de suppression réussit");
    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
                
    };


    transaction.oncomplete = function(){
        console.log("transaction complete");
        // Remet à jour les éléments
        //extraction des modèles de la base
        onUpdateTemplateBddList(true);


        // Popup notification
        onShowNotifyPopup(notifyTextArray.templateDeleted);

        //Gestion de l'affichage 
        onLeaveMenu("TemplateEditor");        

    };

};


// ---------------------------- SELECTION D'un TEMPLATE ---------------------------------





function onAnnulSelectTemplate(event) {
    event.stopPropagation();
    if (devMode === true){console.log("Traitement pour quitter le menu : TemplateChoice");};
    onChangeDisplay(["divTemplateChoice"],[],[],[],[],[],[]);
}







// Génération de la liste des modèle lors de la selection d'un modèle pour créer une activité
function onCreateTemplateChoiceList() {
    if (devMode === true){console.log(" [TEMPLATE] génération de la liste pour choisir le modèle");};

    let divTemplateChoiceListRef = document.getElementById("divTemplateChoiceList");
    // Reset
    divTemplateChoiceListRef.innerHTML = "";

    // Génère la liste
    userTemplateList.forEach((e,index)=>{

        // Creation
        let newContainer = document.createElement("div");
        newContainer.classList.add("fake-opt-item-container");
        newContainer.onclick = function (){
            onChangeMenu("NewActivityFromTemplate");
            onSearchTemplateToDisplay(e.key,true); 
        }

        // Style sans border botton pour le dernier
        if (index === (userTemplateList.length - 1)) {
            newContainer.classList.add("fake-opt-item-last-container");
        }




        let newImg = document.createElement("img");
        newImg.classList.add("fake-opt-item");
        newImg.src = activityChoiceArray[e.activityName].imgRef;

        let newTitle = document.createElement("span");
        newTitle.innerHTML = e.title;
        newTitle.classList.add("fake-opt-item");


        // Bouton radio fake pour simuler le selecteur
        let newBtnRadioFake = document.createElement("div");
        newBtnRadioFake.classList.add("radio-button-fake");

        // Effet bouton plein pour le premier item de la liste
        if (index === 0) {
            newBtnRadioFake.classList.add("selected");
        }




        // Insertion

        newContainer.appendChild(newImg);
        newContainer.appendChild(newTitle);
        newContainer.appendChild(newBtnRadioFake);

        divTemplateChoiceListRef.appendChild(newContainer);
    });
}








// Quitte le menu
function onClickReturnFromGestTemplate() {
    onLeaveMenu("GestTemplate");
}

