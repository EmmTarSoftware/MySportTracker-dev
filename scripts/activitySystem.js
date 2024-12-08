// Tableau des activités
let activityChoiceArray = [
    {dataName : "C.A.P", displayName: "Course à pied", color : "", imgRef :"./images/icon-cap.png"},
    {dataName : "FRACTIONNE", displayName:"Fractionné/interval",color : "", imgRef :"./images/icon-intense-running.png"},
    {dataName : "MARCHE-RANDO", displayName:"Marche/Randonnée",color : "", imgRef :"./images/icon-marche.png"},
    {dataName : "VELO", displayName:"Vélo",color : "", imgRef :"./images/icon-velo.png"},
    {dataName : "NATATION", displayName:"Natation",color : "", imgRef :"./images/icon-natation.png"},
    {dataName : "CROSSFIT", displayName:"Crossfit",color : "", imgRef :"./images/icon-crossfit.png"},
    {dataName : "YOGA", displayName:"Yoga",color : "", imgRef :"./images/icon-yoga.png"},
    {dataName : "SPORT-CO", displayName:"Sport-co divers",color : "", imgRef :"./images/icon-sport-co.png"},
    {dataName : "ESCALADE", displayName:"Escalade",color : "", imgRef :"./images/icon-escalade.png"},
    {dataName : "BOXE", displayName:"Boxe",color : "", imgRef :"./images/icon-boxe.png"},
    {dataName : "SKI", displayName:"Ski",color : "", imgRef :"./images/icon-ski.png"},
    {dataName : "TRIATHLON", displayName:"Triathlon",color : "", imgRef :"./images/icon-triathlon.png"},
    {dataName : "ACTIVITE-NAUTIQUE", displayName:"Activité nautique",color : "", imgRef :"./images/icon-nautique.png"},
    {dataName : "ETIREMENT", displayName:"Etirements",color : "", imgRef :"./images/icon-stretching.png"},
    {dataName : "GOLF", displayName:"Golf",color : "", imgRef :"./images/icon-golf.png"},
    {dataName : "TENNIS", displayName:"Tennis",color : "", imgRef :"./images/icon-tennis.png"},
    {dataName : "PATIN-ROLLER", displayName:"Patinage/Roller",color : "", imgRef :"./images/icon-patin.png"},
    {dataName : "DANSE", displayName:"Danse",color : "", imgRef :"./images/icon-danse.png"},
    {dataName : "MUSCULATION", displayName:"Musculation",color : "", imgRef :"./images/icon-musculation.png"},
    {dataName : "BADMINTON", displayName:"Badminton",color : "", imgRef :"./images/icon-badminton.png"},
    {dataName : "BASKETBALL", displayName:"Basketball",color : "", imgRef :"./images/icon-basketball.png"},
    {dataName : "FOOTBALL", displayName:"Football",color : "", imgRef :"./images/icon-football.png"},
    {dataName : "HANDBALL", displayName:"Handball",color : "", imgRef :"./images/icon-handball.png"},
    {dataName : "RUGBY", displayName:"Rugby",color : "", imgRef :"./images/icon-rugby.png"},
    {dataName : "TENNIS-TABLE", displayName:"Tennis de table",color : "", imgRef :"./images/icon-tennis-de-table.png"},
    {dataName : "VOLLEYBALL", displayName:"Volleyball",color : "", imgRef :"./images/icon-volley.png"},
    {dataName : "EQUITATION", displayName:"Equitation",color : "", imgRef :"./images/icon-equitation.png"},
    {dataName : "SNOWBOARD", displayName:"Snowboard",color : "", imgRef :"./images/icon-snowboard.png"},
    {dataName : "BASEBALL", displayName:"Baseball",color : "", imgRef :"./images/icon-baseball.png"},
    {dataName : "AUTRE", displayName:"Autre/divers",color : "", imgRef :"./images/icon-autre-divers.png"},
    {dataName : "ARTS-MARTIAUX", displayName:"Arts martiaux",color : "", imgRef :"./images/icon-art-martiaux.png"},
    {dataName : "BREAK-DANCE", displayName:"Break dance",color : "", imgRef :"./images/icon-breakdance.png"}

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
    userActivityListToDisplay = [], // contient les activité trié et filtré à afficher
    maxActivityPerCycle = 30,//Nbre d'élément maximale à afficher avant d'avoir le bouton "afficher plus"
    userActivityListIndexToStart = 0; //Index de démarrage pour l'affichage d'activité





// Reférencement

let pInterfaceActivityTitleRef = document.getElementById("pInterfaceActivityTitle"),
    inputDateRef = document.getElementById("inputDate"),
    inputLocationRef = document.getElementById("inputLocation"),
    inputDistanceRef = document.getElementById("inputDistance"),
    inputDurationRef = document.getElementById("inputDuration"),
    textareaCommentRef = document.getElementById("textareaComment"),
    selectorCategoryChoiceRef = document.getElementById("selectorCategoryChoice"),
    divItemListRef = document.getElementById("divItemList");












// Génération des options d'activité dans l'éditeur d'activité
function onGenerateActivityOptionChoice() {


    // Traite d'abord les favoris
    console.log("[Activity Choice] Lancement de la generation des choix des activités");

    let selectorRef = document.getElementById("selectorCategoryChoice");
    console.log("[Activity Choice] Reset les éléments");
    selectorRef.innerHTML = "";

    console.log("[Activity Choice] ajout des favoris si présent = " + userFavoris.length);
    userFavoris.sort();

    userFavoris.forEach(activity => {

        // Recherche tout l'élément dans la base du choix des activité via son dataName
        let fullActivityItem = getActivityChoiceArrayRefByDataName(activity);


        let newOption = document.createElement("option");
        newOption.value = fullActivityItem.dataName;
        newOption.innerHTML = " * " +  fullActivityItem.displayName;
        selectorRef.appendChild(newOption);
        console.log("ajout");
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
    console.log("ouverture de l'editeur d'activité en mode " + activityEditorMode);

    // Initialise les éléments
    onResetActivityInputs();

};




// Reset les inputs du menu activité
function onResetActivityInputs() {
    console.log("reset les inputs du menu activité");
    inputDateRef.value = "";
    inputLocationRef.value = "";
    inputDistanceRef.value = "";
    inputDurationRef.value = "00:00:00";
    textareaCommentRef.value = "";

    inputDateRef.classList.remove("fieldRequired");
};




// actualisation de la liste d'activité

function onUpdateActivityBddList() {

    console.log("Actualisation de la liste d'activité");
    allUserActivityArray = [];


    // recupere les éléments dans la base et les stock dans un tableau temporaire
    
    let transaction = db.transaction([activityStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(activityStoreName);
    let indexStoreTask = objectStoreTask.index("date");//Filtre par défaut sur l'index des dates
    let requestTask = indexStoreTask.getAll();


    requestTask.onsuccess = function (){
        console.log("[ DATABASE] ]Les éléments ont été récupéré dans la base");

    };


    requestTask.error = function (){
        console.log("Erreur de requete sur la base");
    };


    transaction.oncomplete = function (){
        // stockage des données dans l'array des activités

        console.log("stockage des données dans allUserActivityArray")
        allUserActivityArray = requestTask.result;

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

    console.log("nbre d'activité total à afficher = " + userActivityListToDisplay.length);
    console.log("Nbre max d'activité affiché par cycle = " + maxActivityPerCycle);
    console.log("Vide la liste des activités");
    divItemListRef.innerHTML = "";

    if (userActivityListToDisplay.length === 0) {
        divItemListRef.innerHTML = "Aucune activité à afficher !";
        return
    }else{
        console.log("Demande d'insertion du premier cycle d'activité dans la liste");
        onInsertMoreActivity();
    };


};

// séquence d'insertion  d'activité dans la liste selon le nombre limite définit
function onInsertMoreActivity() {
    console.log("Lancement d'un cycle d'insertion d'activité.")
    let cycleCount = 0;

    console.log("Index de départ = " + userActivityListIndexToStart);

    for (let i = userActivityListIndexToStart; i < userActivityListToDisplay.length; i++) {

        if (cycleCount >= maxActivityPerCycle) {
            console.log("Max par cycle atteinds = " + maxActivityPerCycle);
            // Creation du bouton More
            onCreateMoreActivityBtn();
            userActivityListIndexToStart += maxActivityPerCycle;
            console.log("mise a jour du prochain index to start = " + userActivityListIndexToStart);
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
    newItemContainer.className = "item-container";

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
    

    // Insertion totale
    newDivDataContainer.appendChild(newDivDataArea1);
    newDivDataContainer.appendChild(newDivDataArea2);

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
        console.log("Suppression du bouton More Item");
    } else {
        console.log("Le bouton more item n'est pas trouvé");
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











// ------------------------------------- Modification d'activité --------------------------------
let currentKeyActivityInView = 0;




// clique sur un item
function onClickOnActivity(keyRef) {
    onResetActivityInputs();
    onSearchActivityInBaseToDisplay(keyRef);
    onChangeMenu("EditActivity");

};








function onSearchActivityInBaseToDisplay(keyRef) {
    console.log("Affichage de l'activité avec la key :  " + keyRef);
    

    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("lecture de la Base de Données");
    let transaction = db.transaction(activityStoreName);//readonly
    let objectStore = transaction.objectStore(activityStoreName);
    let request = objectStore.getAll(IDBKeyRange.only(keyRef));
    
    
    request.onsuccess = function (){
        console.log("Requete de recherche réussit");
        console.log(request.result);

        // Affiche la note voulue
        let tempResult = request.result;
        console.log(tempResult[0]);
        onEditActivity(tempResult[0]);
    };

    request.onerror = function (){
        console.log("Erreur lors de la recherche");
    };

};




function onEditActivity(activityTarget) {

    // Set le mode d'edition de l'activité
    activityEditorMode = "modification";


    console.log("ouverture de l'editeur d'activité en mode " + activityEditorMode);



    // set la variable qui stocke la key de l'activité en cours de visualisation
    currentKeyActivityInView = activityTarget.key;


    selectorCategoryChoiceRef.value = activityTarget.name;
    inputDateRef.value = activityTarget.date;
    inputLocationRef.value = activityTarget.location;
    inputDistanceRef.value = activityTarget.distance;
    inputDurationRef.value = activityTarget.duration;
    textareaCommentRef.value = activityTarget.comment;

};


// Enregistrement de l'activité modifié
function onSaveModifiedActivity() {
    console.log("Demande de sauvegarde de la modification de l'activité");
}

// -------------------------- Création d'activité ---------------------------------








// formatage de la nouvelle activité avant insertion dans la base
function onFormatActivity() {


    if (activityEditorMode === "creation") {
        console.log("Demande de création nouvelle activité");
    }else if(activityEditorMode === "modification"){
        console.log("Demande d'enregistrement d'une modification d'activité");
    };
    



    // Verification des champs requis
    console.log("[ NEW ACTIVITE ] controle des champs requis");
    let emptyField = onCheckEmptyField(inputDateRef.value);

    if (emptyField === true) {
        console.log("[ NEW ACTIVITE ] Champ obligatoire non remplis");

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
        onInsertModification(activityToInsertFormat);
    };

};






// Insertion d'une nouvelle activité

function onInsertNewActivity(dataToInsert) {
    let transaction = db.transaction(activityStoreName,"readwrite");
    let store = transaction.objectStore(activityStoreName);

    let insertRequest = store.add(dataToInsert);

    insertRequest.onsuccess = function () {
        console.log(" [ DATABASE ] " + dataToInsert.name + "a été ajouté à la base");
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
    console.log("fonction d'insertion de la donnée modifié");

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
    
    console.log("demande de suppression d'activité ");
    // L'affiche de la div doit se faire en "flex" donc je n'utilise pas le onChangeDisplay
    document.getElementById("divConfirmDeleteActivity").classList.add("show");

    onChangeDisplay([],[],[],["divActivityEditor","divBtnActivity"],[],[],[]);

};


function onConfirmDeleteActivity(event){

    event.stopPropagation();// Empêche la propagation du clic vers la div d'annulation
    console.log("Confirmation de suppression d'activité ");
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteActivity").classList.remove("show");
    onDeleteActivity(currentKeyActivityInView);


};


function onAnnulDeleteActivity(event) {
    
    console.log("annulation de la suppression d'activité ");
    // retire la class "show" pour la div de confirmation
    document.getElementById("divConfirmDeleteActivity").classList.remove("show");
    onChangeDisplay([],[],[],[],["divActivityEditor","divBtnActivity"],[],[]);

};




function onDeleteActivity(keyTarget) {
    // recupere les éléments correspondant à la clé recherché et la stoque dans une variable
    console.log("Suppression de l'activité avec la key : " + keyTarget);
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




