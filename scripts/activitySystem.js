// Tableau des activités
let activityChoiceArray = [
    {dataName : "C.A.P", displayName: "Course à pied", colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-cap.webp"},
    {dataName : "FRACTIONNE", displayName:"Fractionné/interval",colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-intense-running.webp"},
    {dataName : "MARCHE-RANDO", displayName:"Marche/Randonnée",colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-marche.webp"},
    {dataName : "VELO", displayName:"Vélo",colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-velo.webp"},
    {dataName : "NATATION", displayName:"Natation",colorNuanceClass : "nuance-turquoise", imgRef :"./images/icon-natation.webp"},
    {dataName : "CROSSFIT", displayName:"Crossfit",colorNuanceClass : "nuance-red", imgRef :"./images/icon-crossfit.webp"},
    {dataName : "YOGA", displayName:"Yoga",colorNuanceClass : "nuance-green-light", imgRef :"./images/icon-yoga.webp"},
    {dataName : "SPORT-CO", displayName:"Sport-co divers",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-sport-co.webp"},
    {dataName : "ESCALADE", displayName:"Escalade",colorNuanceClass : "nuance-dark-gray", imgRef :"./images/icon-escalade.webp"},
    {dataName : "BOXE", displayName:"Boxe",colorNuanceClass : "nuance-light-bluegray", imgRef :"./images/icon-boxe.webp"},
    {dataName : "SKI", displayName:"Ski",colorNuanceClass : "nuance-purple", imgRef :"./images/icon-ski.webp"},
    {dataName : "TRIATHLON", displayName:"Triathlon",colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-triathlon.webp"},
    {dataName : "ACTIVITE-NAUTIQUE", displayName:"Activité nautique",colorNuanceClass : "nuance-turquoise", imgRef :"./images/icon-nautique.webp"},
    {dataName : "ETIREMENT", displayName:"Etirements",colorNuanceClass : "nuance-green-light", imgRef :"./images/icon-stretching.webp"},
    {dataName : "GOLF", displayName:"Golf",colorNuanceClass : "nuance-olive", imgRef :"./images/icon-golf.webp"},
    {dataName : "TENNIS", displayName:"Tennis",colorNuanceClass : "nuance-olive", imgRef :"./images/icon-tennis.webp"},
    {dataName : "PATIN-ROLLER", displayName:"Patinage/Roller",colorNuanceClass : "nuance-purple", imgRef :"./images/icon-patin.webp"},
    {dataName : "DANSE", displayName:"Danse",colorNuanceClass : "nuance-pink", imgRef :"./images/icon-danse.webp"},
    {dataName : "MUSCULATION", displayName:"Musculation",colorNuanceClass : "nuance-red", imgRef :"./images/icon-musculation.webp"},
    {dataName : "BADMINTON", displayName:"Badminton",colorNuanceClass : "nuance-olive", imgRef :"./images/icon-badminton.webp"},
    {dataName : "BASKETBALL", displayName:"Basketball",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-basketball.webp"},
    {dataName : "FOOTBALL", displayName:"Football",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-football.webp"},
    {dataName : "HANDBALL", displayName:"Handball",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-handball.webp"},
    {dataName : "RUGBY", displayName:"Rugby",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-rugby.webp"},
    {dataName : "TENNIS-TABLE", displayName:"Tennis de table",colorNuanceClass : "nuance-olive", imgRef :"./images/icon-tennis-de-table.webp"},
    {dataName : "VOLLEYBALL", displayName:"Volleyball",colorNuanceClass : "nuance-orange", imgRef :"./images/icon-volley.webp"},
    {dataName : "EQUITATION", displayName:"Equitation",colorNuanceClass : "nuance-dark-gray", imgRef :"./images/icon-equitation.webp"},
    {dataName : "SNOWBOARD", displayName:"Snowboard",colorNuanceClass : "nuance-purple", imgRef :"./images/icon-snowboard.webp"},
    {dataName : "BASEBALL", displayName:"Baseball",colorNuanceClass : "nuance-olive", imgRef :"./images/icon-baseball.webp"},
    {dataName : "AUTRE", displayName:"Autre/divers",colorNuanceClass : "nuance-light-bluegray", imgRef :"./images/icon-autre-divers.webp"},
    {dataName : "ARTS-MARTIAUX", displayName:"Arts martiaux",colorNuanceClass : "nuance-light-bluegray", imgRef :"./images/icon-art-martiaux.webp"},
    {dataName : "BREAK-DANCE", displayName:"Break dance",colorNuanceClass : "nuance-pink", imgRef :"./images/icon-breakdance.webp"},
    {dataName : "GYMNASTIQUE", displayName:"Gymnastique",colorNuanceClass : "nuance-pink", imgRef :"./images/icon-gymnastique.webp"},
    {dataName : "ATHLETISME", displayName:"Athlétisme",colorNuanceClass : "nuance-blue-light", imgRef :"./images/icon-athletisme.webp"},
    {dataName : "RENFORCEMENT", displayName:"Renforcement musculaire",colorNuanceClass : "nuance-red", imgRef :"./images/icon-renforcement.webp"},
    {dataName : "SKATEBOARD", displayName:"Skateboard",colorNuanceClass : "nuance-purple", imgRef :"./images/icon-skate.webp"}
];


// Fonction pour extraire un objet dans l'array activityChoiceArray (ci-dessus) via son "dataName"
function getActivityChoiceArrayRefByDataName(dataName) {
    let activity = activityChoiceArray.find(item => item.dataName === dataName);
    return activity ? activity : null; // Retourne l'imgRef ou null si non trouvé
};


// Format de l'objet pour une nouvelle activité
let activityToInsertFormat = {
    name :"",
    date : "",
    location : "",
    distance : "",
    duration : "",
    comment : "",
    userInfo : {
        age : "",
        size: "",
        weight : "",
        gender: "",
    },
    divers:{}
};


let allUserActivityArray = [], //Contient toutes les activités créé par l'utilisateur
    userActivityListToDisplay = [], // contient les activités triées et filtrées à afficher
    maxActivityPerCycle = 20,//Nbre d'élément maximale à afficher avant d'avoir le bouton "afficher plus"
    userActivityListIndexToStart = 0, //Index de démarrage pour l'affichage d'activité
    currentActivityDataInView;//contient les données d'une activité en cours d'affichage. Permet de comparer les modifications




// Reférencement

let pInterfaceActivityTitleRef = document.getElementById("pInterfaceActivityTitle"),
    inputDateRef = document.getElementById("inputDate"),
    inputLocationRef = document.getElementById("inputLocation"),
    inputDistanceRef = document.getElementById("inputDistance"),
    inputDurationRef = document.getElementById("inputDuration"),
    textareaCommentRef = document.getElementById("textareaComment"),
    selectorCategoryChoiceRef = document.getElementById("selectorCategoryChoice"),
    divItemListRef = document.getElementById("divItemList"),
    imgEditorActivityPreviewRef = document.getElementById("imgEditorActivityPreview");











// Génération des options d'activité dans l'éditeur d'activité
function onGenerateActivityOptionChoice() {


    // Traite d'abord les favoris
    if (devMode === true){console.log("[Activity Choice] Lancement de la generation des choix des activités");};

    let selectorRef = document.getElementById("selectorCategoryChoice");
    if (devMode === true){console.log("[Activity Choice] Reset les éléments");};
    selectorRef.innerHTML = "";

    if (devMode === true){console.log("[Activity Choice] ajout des favoris si présent = " + userFavoris.length);};
    userFavoris.sort();

    userFavoris.forEach(activity => {

        // Recherche tout l'élément dans la base du choix des activité via son dataName
        let fullActivityItem = getActivityChoiceArrayRefByDataName(activity);


        let newOption = document.createElement("option");
        newOption.value = fullActivityItem.dataName;
        newOption.innerHTML = " * " +  fullActivityItem.displayName;
        selectorRef.appendChild(newOption);
        if (devMode === true){console.log("ajout de l'option" + fullActivityItem.displayName );};
    });




    // Trier le tableau par ordre alphabétique du displayName
    activityChoiceArray.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Ajouter les autres options triées
    activityChoiceArray.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity.dataName;
        newOption.innerHTML = activity.displayName;
        selectorRef.appendChild(newOption);
    });

};

onGenerateActivityOptionChoice();
















function onOpenNewActivity() {

    activityEditorMode = "creation";
    if (devMode === true){console.log("ouverture de l'editeur d'activité en mode " + activityEditorMode);};

    // Initialise les éléments
    onResetActivityInputs();

};




// Reset les inputs du menu activité
function onResetActivityInputs() {
    if (devMode === true){console.log("reset les inputs du menu activité");};
    inputDateRef.value = "";
    inputLocationRef.value = "";
    inputDistanceRef.value = "";
    inputDurationRef.value = "00:00:00";
    textareaCommentRef.value = "";
    selectorCategoryChoiceRef.value = "C.A.P";


    // l'image de prévisualisation 
    let dataActivityTarget = getActivityChoiceArrayRefByDataName("C.A.P");
    imgEditorActivityPreviewRef.src = dataActivityTarget.imgRef;

    inputDateRef.classList.remove("fieldRequired");
};




// actualisation de la liste d'activité

function onUpdateActivityBddList() {

    if (devMode === true){console.log("Actualisation de la liste d'activité");};
    allUserActivityArray = [];


    // recupere les éléments dans la base et les stock dans un tableau temporaire
    
    let transaction = db.transaction([activityStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(activityStoreName);
    let indexStoreTask = objectStoreTask.index("date");//Filtre par défaut sur l'index des dates
    let requestTask = indexStoreTask.getAll();


    requestTask.onsuccess = function (){
        if (devMode === true){console.log("[ DATABASE] ]Les éléments ont été récupéré dans la base");};

    };


    requestTask.error = function (){
       console.log("Erreur de requete sur la base");
    };


    transaction.oncomplete = function (){
        // stockage des données dans l'array des activités

        if (devMode === true){console.log("stockage des données dans allUserActivityArray");};
        allUserActivityArray = requestTask.result;

        if (devMode === true){console.log(allUserActivityArray);};



        // Remet les tries et filtres par défaut
        onResetSortAndFilter();

        // Generation du trie dynamique
        onGenerateDynamiqueFilter(allUserActivityArray);

        // Lancement de l'actualisation sur le filtre en cours
        onFilterActivity(currentSortType,currentFilter,allUserActivityArray);


    };
};




// Insertion des activités dans la liste

function onInsertActivityInList(activityToDisplay) {

    // Stock les activité à afficher dans un tableau
    userActivityListToDisplay = activityToDisplay;
    userActivityListIndexToStart = 0;


    if (devMode === true){
        console.log("nbre d'activité total à afficher = " + userActivityListToDisplay.length);
        console.log("Nbre max d'activité affiché par cycle = " + maxActivityPerCycle);
        console.log("Vide la liste des activités");
    };

    divItemListRef.innerHTML = "";

    if (userActivityListToDisplay.length === 0) {
        divItemListRef.innerHTML = "Aucune activité à afficher !";
        return
    }else{
        if (devMode === true){console.log("Demande d'insertion du premier cycle d'activité dans la liste");};
        onInsertMoreActivity();
    };


};

// séquence d'insertion  d'activité dans la liste selon le nombre limite définit
function onInsertMoreActivity() {
    if (devMode === true){console.log("Lancement d'un cycle d'insertion d'activité.");};
    let cycleCount = 0;

    if (devMode === true){console.log("Index de départ = " + userActivityListIndexToStart);};



    for (let i = userActivityListIndexToStart; i < userActivityListToDisplay.length; i++) {

        if (cycleCount >= maxActivityPerCycle) {
            if (devMode === true){console.log("Max par cycle atteinds = " + maxActivityPerCycle);};
            // Creation du bouton More
            onCreateMoreActivityBtn();
            userActivityListIndexToStart += maxActivityPerCycle;
            if (devMode === true){console.log("mise a jour du prochain index to start = " + userActivityListIndexToStart);};
            // Arrete la boucle si lorsque le cycle est atteind
            return
        }else{
            onInsertOneActivity(userActivityListToDisplay[i]);
        };
        cycleCount++;
    };

    
};




// Fonction d'insertion d'une activité dans la liste
function onInsertOneActivity(activity) {

    let activityArrayItem = getActivityChoiceArrayRefByDataName(activity.name);


    // La div de l'item
    let newItemContainer = document.createElement("div");
    newItemContainer.className = `item-container ${activityArrayItem.colorNuanceClass}`;

    newItemContainer.onclick = function () {
        onClickOnActivity(activity.key);
    };


    // La zone de l'image
    let newImageContainer = document.createElement("div");
    newImageContainer.className = "item-image-container";

    let newImage = document.createElement("img");
    newImage.className = "activity";
    newImage.src = activityArrayItem.imgRef;

    newImageContainer.appendChild(newImage);



    // la done des données

    let newDivDataContainer =  document.createElement("div");
    newDivDataContainer.className = "item-data-container";


    // Area 1
    let newDivDataArea1 = document.createElement("div");
    newDivDataArea1.className = "item-data-area1";

    let newItemDistance = document.createElement("p");
    newItemDistance.className = "item-data-distance";
    newItemDistance.innerHTML = activity.distance != "" ? activity.distance + " km": "---";

    let newItemDuration = document.createElement("p");
    newItemDuration.className = "item-data-duration";
    newItemDuration.innerHTML = activity.duration;

    let newItemDate = document.createElement("p");
    newItemDate.className = "item-data-date";
    if (activity.date === dateToday) {
        newItemDate.innerHTML = "Auj.";
    }else if (activity.date === dateYesterday) {
        newItemDate.innerHTML = "Hier";
    }else{
        newItemDate.innerHTML = onFormatDateToFr(activity.date);
    };

    

    newDivDataArea1.appendChild(newItemDistance);
    newDivDataArea1.appendChild(newItemDuration);
    newDivDataArea1.appendChild(newItemDate);

    // Area 2
    let newDivDataArea2 = document.createElement("div");
    newDivDataArea2.className = "item-data-area2";

    let newItemLocation = document.createElement("p");
    newItemLocation.className = "item-data-location";
    newItemLocation.innerHTML = activity.location != "" ? activity.location : "---";

    newDivDataArea2.appendChild(newItemLocation);
    

    // Area3
    let newDivDataArea3 = document.createElement("div");
    newDivDataArea3.className = "item-data-area3";

    let newItemComment = document.createElement("p");
    newItemComment.className = "item-data-comment";
    newItemComment.innerHTML = activity.comment;
    newDivDataArea3.appendChild(newItemComment);


    // Insertion totale
    newDivDataContainer.appendChild(newDivDataArea1);
    newDivDataContainer.appendChild(newDivDataArea2);
    newDivDataContainer.appendChild(newDivDataArea3);

    newItemContainer.appendChild(newImageContainer);
    newItemContainer.appendChild(newDivDataContainer);

    divItemListRef.appendChild(newItemContainer);
};


// Fonction pour le bouton MoreActivity pour afficher les activités utilisateurs suivantes

function onCreateMoreActivityBtn() {


    // La div de l'item
    let newItemContainerBtnMore = document.createElement("div");
    newItemContainerBtnMore.className = "moreItem";
    newItemContainerBtnMore.id = "btnMoreItem";

    newItemContainerBtnMore.onclick = function (){
        onDeleteBtnMoreItem();
        onInsertMoreActivity();
    };


    let newTextBtnMore = document.createElement("p");
    newTextBtnMore.className = "moreItem";
    newTextBtnMore.innerHTML = "Afficher plus d'activités";

    // Insertion


    newItemContainerBtnMore.appendChild(newTextBtnMore);

    divItemListRef.appendChild(newItemContainerBtnMore);

};




// Fonction pour supprimer le bouton "more item"
function onDeleteBtnMoreItem() {
    // Sélection de l'élément avec l'ID "liToto"
    let btnToDelete = document.getElementById("btnMoreItem");
    
    // Vérification si l'élément existe avant de le supprimer
    if (btnToDelete) {
        btnToDelete.remove();
        if (devMode === true){console.log("Suppression du bouton More Item");};
    } else {
        if (devMode === true){console.log("Le bouton more item n'est pas trouvé");};
    };
};














// ---------------------------------  EDITEUR d'activité ---------------------

// Variable pour connaitre dans quel mode l'editeur d'activité est ouvert
let activityEditorMode; // creation ou modification










function onClickReturnFromActivityEditor() {
    onLeaveMenu("Activity");
};






function onClickSaveFromActivityEditor() {

    // Lancement du formatage de l'activité
    onFormatActivity();
};



// Set l'image de prévisualisation d'activité dans l'éditeur
function onChangeActivityPreview(dataName) {
    // recherche les éléments via nom dataName : 
    let activity = getActivityChoiceArrayRefByDataName(dataName.value);

    imgEditorActivityPreviewRef.src = activity.imgRef;
} 






// ------------------------------------- Modification d'activité --------------------------------
let currentKeyActivityInView = 0;




// clique sur un item
function onClickOnActivity(keyRef) {
    onResetActivityInputs();
    // onSearchActivityInBaseToDisplay(keyRef);
    onSearchActivityToDisplay(keyRef);
    onChangeMenu("EditActivity");

};




// Fonction de recherche d'une activité à afficher depuis la AllUserActivityArray.
function onSearchActivityToDisplay(keyRef) {
    if (devMode === true){console.log("Affichage de l'activité dans 'AllUserActivityArray' avec la key :  " + keyRef);};
    const activityToDisplay = allUserActivityArray.find(activity => activity.key === keyRef);


    currentActivityDataInView = activityToDisplay;//pour la comparaison par la suite
    onEditActivity(activityToDisplay);
}




// DESACTIVEE !!!
// Fonction de recherche d'une activité à afficher depuis la bdd.
function onSearchActivityInBaseToDisplay(keyRef) {
    if (devMode === true){console.log("Affichage de l'activité dans la BdD avec la key :  " + keyRef);};
    

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    if (devMode === true){console.log("lecture de la Base de Données");};
    let transaction = db.transaction(activityStoreName);//readonly
    let objectStore = transaction.objectStore(activityStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        if (devMode === true){
            console.log("Requete de recherche réussit");
            console.log(request.result);
        };


        // Affiche la note voulue
        let tempResult = request.result;
        if (devMode === true){console.log(tempResult[0]);};
        onEditActivity(tempResult[0]);
    };

    request.onerror = function (){
        console.log("Erreur lors de la recherche");
    };

};




function onEditActivity(activityTarget) {

    // Set le mode d'edition de l'activité
    activityEditorMode = "modification";


    if (devMode === true){console.log("ouverture de l'editeur d'activité en mode " + activityEditorMode);};



    // set la variable qui stocke la key de l'activité en cours de visualisation
    currentKeyActivityInView = activityTarget.key;


    selectorCategoryChoiceRef.value = activityTarget.name;
    inputDateRef.value = activityTarget.date;
    inputLocationRef.value = activityTarget.location;
    inputDistanceRef.value = activityTarget.distance;
    inputDurationRef.value = activityTarget.duration;
    textareaCommentRef.value = activityTarget.comment;

    // l'image de prévisualisation 
    let dataActivityTarget = getActivityChoiceArrayRefByDataName(activityTarget.name);
    imgEditorActivityPreviewRef.src = dataActivityTarget.imgRef;

};


// Enregistrement de l'activité modifié
function onSaveModifiedActivity() {
    if (devMode === true){console.log("Demande de sauvegarde de la modification de l'activité");};
}

// -------------------------- Création d'activité ---------------------------------








// formatage de la nouvelle activité avant insertion dans la base
function onFormatActivity() {


    if (activityEditorMode === "creation") {
        if (devMode === true){console.log("Demande de création nouvelle activité");};
    }else if(activityEditorMode === "modification"){
        if (devMode === true){console.log("Demande d'enregistrement d'une modification d'activité");};
    };
    



    // Verification des champs requis
    if (devMode === true){console.log("[ NEW ACTIVITE ] controle des champs requis");};
    let emptyField = onCheckEmptyField(inputDateRef.value);

    if (emptyField === true) {
        if (devMode === true){console.log("[ NEW ACTIVITE ] Champ obligatoire non remplis");};

        inputDateRef.classList.add("fieldRequired");
        return
    };


    //  met tous les éléments dans l'objet
    activityToInsertFormat.name = selectorCategoryChoiceRef.value;
    activityToInsertFormat.date = inputDateRef.value;
    activityToInsertFormat.distance = inputDistanceRef.value;
    activityToInsertFormat.location = onSetToUppercase(inputLocationRef.value);
    activityToInsertFormat.comment = textareaCommentRef.value;
    activityToInsertFormat.duration = inputDurationRef.value;
    activityToInsertFormat.userInfo = userInfo;
    activityToInsertFormat.divers = {};



    // Demande d'insertion dans la base soit en creation ou en modification


    if (activityEditorMode === "creation") {
        onInsertNewActivity(activityToInsertFormat);
    }else if(activityEditorMode === "modification"){
        onCheckIfModifiedRequired(activityToInsertFormat);
    };

};


// Sauvegarde uniquement si une modification a bien été effectuée dans les données
function onCheckIfModifiedRequired(activityToInsertFormat) {
    
    // Création d'une liste de champs à comparer
    const fieldsToCompare = [
        { oldValue: currentActivityDataInView.name, newValue: activityToInsertFormat.name },
        { oldValue: currentActivityDataInView.date, newValue: activityToInsertFormat.date },
        { oldValue: currentActivityDataInView.distance, newValue: activityToInsertFormat.distance },
        { oldValue: currentActivityDataInView.location, newValue: activityToInsertFormat.location },
        { oldValue: currentActivityDataInView.comment, newValue:  activityToInsertFormat.comment },
        { oldValue: currentActivityDataInView.duration, newValue:  activityToInsertFormat.duration },
        { oldValue: currentActivityDataInView.divers, newValue:  activityToInsertFormat.divers }
        // Ne pas mettre la donnée userInfo Ici. 
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
        if (devMode) console.log("[ACTIVITY] Informations d'activité différentes : Lancement de l'enregistrement en BdD");
        onInsertModification(activityToInsertFormat);
    } else {
        if (devMode) console.log("[ACTIVITY] Aucune modification de d'activité nécessaire !");
         //Gestion de l'affichage 
        onLeaveMenu("Activity");
    }



}



// Insertion d'une nouvelle activité

function onInsertNewActivity(dataToInsert) {
    let transaction = db.transaction(activityStoreName,"readwrite");
    let store = transaction.objectStore(activityStoreName);

    let insertRequest = store.add(dataToInsert);

    insertRequest.onsuccess = function () {
        if (devMode === true){console.log(" [ DATABASE ] " + dataToInsert.name + "a été ajouté à la base");};
        // evenement de notification



        // Clear l'editeur d'activité
        
    };

    insertRequest.onerror = function(event){
        console.log(" [ DATABASE ] Error d'insertion activité");
        let errorMsg = event.target.error.toString();
       console.log(errorMsg);
        
    };

    transaction.oncomplete = function(){
        console.log("[ DATABASE ] transaction insertData complete");


        // Remet à jour les éléments
        onUpdateActivityBddList("dateRecente");

        // Popup notification
        onShowNotifyPopup(notifyTextArray.creation);

        //Gestion de l'affichage 
        onLeaveMenu("Activity");
    };
};






// Insertion d'une modification d'une activité
function onInsertModification(e) {
    if (devMode === true){console.log("fonction d'insertion de la donnée modifié");};

    let transaction = db.transaction(activityStoreName,"readwrite");
    let store = transaction.objectStore(activityStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(currentKeyActivityInView));

    

    modifyRequest.onsuccess = function () {
        console.log("modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.name = e.name;
        modifiedData.date = e.date;
        modifiedData.distance = e.distance;
        modifiedData.location = e.location;
        modifiedData.comment = e.comment;
        modifiedData.duration = e.duration;
        modifiedData.divers = e.divers;
        // modifiedData.userInfo = e.userInfo; Les userInfo stockés dans la base lors de la création de l'activité ne doivent pas être modifiés afin de conservé les données d'origines

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("insertModifiedData = success");

        };

        insertModifiedData.onerror = function (){
           console.log("insertModifiedData = error",insertModifiedData.error);

            
        };


    };

    modifyRequest.onerror = function(){
        console.log("ModifyRequest = error");
    };

    transaction.oncomplete = function(){
        console.log("transaction complete");
        // Remet à jour les éléments
        onUpdateActivityBddList("dateRecente");

        // Popup notification
        onShowNotifyPopup(notifyTextArray.modification);

        //Gestion de l'affichage 
       onLeaveMenu("Activity");

    };
};







// --------------------- SUPPRESSION ACTIVITE --------------------------


// Suppression d'activité
function onClickDeleteFromActivityEditor() {
    
    if (devMode === true){console.log("demande de suppression d'activité ");};
    // L'affiche de la div doit se faire en "flex" donc je n'utilise pas le onChangeDisplay
    document.getElementById("divConfirmDeleteActivity").classList.add("show");

    onChangeDisplay([],[],[],["divActivityEditor","divBtnActivity"],[],[],[]);

};


function onConfirmDeleteActivity(event){

    event.stopPropagation();// Empêche la propagation du clic vers la div d'annulation
    if (devMode === true){console.log("Confirmation de suppression d'activité ");};
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteActivity").classList.remove("show");
    onDeleteActivity(currentKeyActivityInView);


};


function onAnnulDeleteActivity(event) {
    
    if (devMode === true){console.log("annulation de la suppression d'activité ");};
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteActivity").classList.remove("show");
    onChangeDisplay([],[],[],[],["divActivityEditor","divBtnActivity"],[],[]);

};




function onDeleteActivity(keyTarget) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    if (devMode === true){console.log("Suppression de l'activité avec la key : " + keyTarget);};
    let transaction = db.transaction(activityStoreName,"readwrite");//transaction en écriture
    let objectStore = transaction.objectStore(activityStoreName);
    let request = objectStore.delete(IDBKeyRange.only(keyTarget));
    
    
    request.onsuccess = function (){
        console.log("Requete de suppression réussit");


    };

    request.onerror = function (){
        console.log("Erreur lors de la requete de suppression");
                
    };


    transaction.oncomplete = function(){
        console.log("transaction complete");
        // Remet à jour les éléments
        onUpdateActivityBddList("dateRecente");


        // Popup notification
        onShowNotifyPopup(notifyTextArray.delete);

        //Gestion de l'affichage 
        onLeaveMenu("Activity");        

    };

};




