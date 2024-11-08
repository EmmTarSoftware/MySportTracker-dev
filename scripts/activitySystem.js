// Tableau des activités
let activityArray = [
    {dataName : "C.A.P", displayName: "Course à pied", color : "", imgRef :"./images/icon-cap.png"},
    {dataName : "FRACTIONNE", displayName:"Fractionné",color : "", imgRef :"./images/Icon-intense-running.png"},
    {dataName : "MARCHE-RANDO", displayName:"Marche/Randonnée",color : "", imgRef :"./images/Icon-Marche.png"},
    {dataName : "VELO", displayName:"Vélo",color : "", imgRef :"./images/Icon-Velo.png"},
    {dataName : "NATATION", displayName:"Natation",color : "", imgRef :"./images/Icon-Natation.png"},
    {dataName : "CROSSFIT", displayName:"Crossfit",color : "", imgRef :"./images/Icon-Crossfit.png"},
    {dataName : "YOGA", displayName:"Yoga",color : "", imgRef :"./images/Icon-Yoga.png"},
    {dataName : "SPORT-CO", displayName:"Sport-co",color : "", imgRef :"./images/Icon-Sport-Co.png"},
    {dataName : "ESCALADE", displayName:"Escalade",color : "", imgRef :"./images/Icon-Escalade.png"},
    {dataName : "ARTS-MARTIAUX", displayName:"Arts martiaux",color : "", imgRef :"./images/Icon-Boxe.png"},
    {dataName : "SKI-SNOW", displayName:"Ski/Snowboard",color : "", imgRef :"./images/Icon-ski.png"},
    {dataName : "TRIATHLON", displayName:"Triathlon",color : "", imgRef :"./images/Icon-Triathlon.png"},
    {dataName : "ACTIVITE-NAUTIQUE", displayName:"Activité nautique",color : "", imgRef :"./images/Icon-Nautique.png"},
    {dataName : "STRETCHING", displayName:"Etirements",color : "", imgRef :"./images/Icon-Stretching.png"},
    {dataName : "GOLF", displayName:"Golf",color : "", imgRef :"./images/Icon-Golf.png"},
    {dataName : "TENNIS-BAD", displayName:"Tennis/Badminton",color : "", imgRef :"./images/Icon-Tennis.png"},
    {dataName : "PATIN-ROLLER", displayName:"Patinage/Roller",color : "", imgRef :"./images/Icon-Patin.png"},
    {dataName : "DANSE", displayName:"Danse",color : "", imgRef :"./images/Icon-Danse.png"},
    {dataName : "MUSCULATION", displayName:"Musculation",color : "", imgRef :"./images/Icon-Musculation.png"}

];


// Format de l'objet pour une nouvelle activité
let newActivityFormat = {
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


let allActivityArray = [];

// Reférencement

let pInterfaceActivityTitleRef = document.getElementById("pInterfaceActivityTitle"),
    inputDateRef = document.getElementById("inputDate"),
    inputLocationRef = document.getElementById("inputLocation"),
    inputDistanceRef = document.getElementById("inputDistance"),
    inputDurationRef = document.getElementById("inputDuration"),
    textareaCommentRef = document.getElementById("textareaComment"),
    selectorCategoryChoiceRef = document.getElementById("selectorCategoryChoice"),
    divItemListRef = document.getElementById("divItemList");






// Génération des options d'activité pour le filtre avec tri
function onGenerateActivityOptionFilter() {

    let selectorRef = document.getElementById("selectorCategoryFilter");
    selectorRef.innerHTML = "";

    // Trier le tableau par ordre alphabétique du displayName
    activityArray.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Ajouter l'option "Tous" au début
    let allOption = document.createElement("option");
    allOption.value = "ALL";
    allOption.innerHTML = "Tous";
    selectorRef.appendChild(allOption);

    // Ajouter les autres options triées
    activityArray.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity.dataName;
        newOption.innerHTML = activity.displayName;
        selectorRef.appendChild(newOption);
    });

};

onGenerateActivityOptionFilter();




// Génération des options d'activité dans l'éditeur d'activité
function onGenerateActivityOptionChoice() {

    let selectorRef = document.getElementById("selectorCategoryChoice");
    selectorRef.innerHTML = "";

    // Trier le tableau par ordre alphabétique du displayName
    activityArray.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Ajouter les autres options triées
    activityArray.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity.dataName;
        newOption.innerHTML = activity.displayName;
        selectorRef.appendChild(newOption);
    });

};

onGenerateActivityOptionChoice();












// clique sur un item

function onClickOnActivity() {

    onGenerateFakeActivityView();
    onChangeDisplay(["divMainBtnMenu"],["divActivityEditor"],["divHome"],[],[],["btnDeleteActivity"]);

};


// Genere une fausse activité pour le prototype
function onGenerateFakeActivityView() {
    pInterfaceActivityTitleRef.innerHTML = "Editer une activité";
    inputDateRef.value = "2024-10-12";
    inputLocationRef.value = "PARIS";
    inputDistanceRef.value = 3.5;
    inputDurationRef.value = "01:20:00";
    textareaCommentRef.value = "J'étais fatigué ce jour là.";
};



function onClickNewActivity() {
    pInterfaceActivityTitleRef.innerHTML = "Créer une activité";

    // Initialise les éléments
    onResetActivityInputs();

    // Gestion de l'affichage
    onChangeDisplay(["divMainBtnMenu" ],["divActivityEditor"],["divHome"],[],["btnDeleteActivity"],[]);
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

function onUpdateActivityList(sortType) {

    console.log("Actualisation de la liste d'activité");
    allActivityArray = [];


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

        console.log("stockage des données dans allActivityArray")
        allActivityArray = requestTask.result;
        



        // Lancement du trie selon le format par défaut ( date plus récente)
        onSortData(sortType);
    };
};



// Fonction du trie 
function onSortData(sortType) {

    console.log("trie par : " + sortType );

    if (sortType === "date+") {
        allActivityArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante
    }else if (sortType === "date-") {
        allActivityArray.sort((a, b) => new Date(a.date) - new Date(b.date)); // Tri par date croissante
    }else if (sortType === "distance-") {
        allActivityArray.sort((a, b) => a.distance - b.distance); // Tri par distance croissante
    }else if (sortType === "distance+") {
        allActivityArray.sort((a, b) => b.distance - a.distance); // Tri par distance décroissante
    }else if (sortType === "duration-") {
        allActivityArray.sort((a, b) => onConvertTimeToSecond(a.duration) - onConvertTimeToSecond(b.duration)); // Tri par distance croissante
    }else if (sortType === "duration+") {
        allActivityArray.sort((a, b) => onConvertTimeToSecond(b.duration) - onConvertTimeToSecond(a.duration)); // Tri par distance décroissante
    };

    console.log(allActivityArray);

    // Insertion des activités dans la liste
    onInsertActivityInList();
};


// Insertion des activités dans la liste

function onInsertActivityInList() {

    divItemListRef.innerHTML = "";

    console.log("Insertion des activités dans la liste");



    allActivityArray.forEach(activity=>{


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
        newImage.src = getImageRefByDataName(activity.name);

        newImageContainer.appendChild(newImage);



        // la done des données

        let newDivDataContainer =  document.createElement("div");
        newDivDataContainer.className = "item-data-container";


        // Area 1
        let newDivDataArea1 = document.createElement("div");
        newDivDataArea1.className = "item-data-area1";

        let newItemDistance = document.createElement("p");
        newItemDistance.className = "item-data-distance";
        newItemDistance.innerHTML = activity.distance + " km";

        let newItemDuration = document.createElement("p");
        newItemDuration.className = "item-data-duration";
        newItemDuration.innerHTML = activity.duration;

        let newItemDate = document.createElement("p");
        newItemDate.className = "item-data-date";
        newItemDate.innerHTML = activity.date;

        newDivDataArea1.appendChild(newItemDistance);
        newDivDataArea1.appendChild(newItemDuration);
        newDivDataArea1.appendChild(newItemDate);

        // Area 2
        let newDivDataArea2 = document.createElement("div");
        newDivDataArea2.className = "item-data-area2";

        let newItemLocation = document.createElement("p");
        newItemLocation.className = "item-data-location";
        newItemLocation.innerHTML = activity.location;

        newDivDataArea2.appendChild(newItemLocation);
        

        // Insertion totale
        newDivDataContainer.appendChild(newDivDataArea1);
        newDivDataContainer.appendChild(newDivDataArea2);

        newItemContainer.appendChild(newImageContainer);
        newItemContainer.appendChild(newDivDataContainer);

        divItemListRef.appendChild(newItemContainer);
    });

};












// ---------------------------------  EDITEUR d'activité ---------------------












function onClickReturnFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
};

function onClickDeleteFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
};

function onClickSaveFromActivityEditor() {

    // Création de la nouvelle activité
    onCreateNewActivity();


};




// formatage de la nouvelle activité avant insertion dans la base
function onCreateNewActivity() {
    console.log("Demande de création nouvelle activité");
  
    // Verification des champs requis
    console.log("[ NEW ACTIVITE ] controle des champs requis");
    let emptyField = onCheckEmptyField(inputDateRef.value);

    if (emptyField === true) {
        console.log("[ NEW ACTIVITE ] Champ obligatoire non remplis");

        inputDateRef.classList.add("fieldRequired");
        return
    };


    //  met tous les éléments dans l'objet
    newActivityFormat.name = selectorCategoryChoiceRef.value;
    newActivityFormat.date = inputDateRef.value;
    newActivityFormat.distance = inputDistanceRef.value;
    newActivityFormat.location = onSetToUppercase(inputLocationRef.value);
    newActivityFormat.comment = textareaCommentRef.value;
    newActivityFormat.duration = inputDurationRef.value;
    newActivityFormat.userInfo = userInfo;
    newActivityFormat.divers = {};


    console.log(newActivityFormat.location);
    // Demande d'insertion dans la base

    onInsertNewActivity(newActivityFormat);

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

        onUpdateActivityList("date+");

        //Gestion de l'affichage 
        onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
    };
};