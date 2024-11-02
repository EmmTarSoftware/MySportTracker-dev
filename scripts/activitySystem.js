// Tableau des activités
let activityArray = [
    {dataName : "RUNNING", displayName: "Course à pied", color : "", imgRef :"./images/"},
    {dataName : "INTERVAL", displayName:"Fractionné",color : "", imgRef :"./images/"},
    {dataName : "HIKING", displayName:"Marche/Randonnée",color : "", imgRef :"./images/"},
    {dataName : "CYCLING", displayName:"Vélo",color : "", imgRef :"./images/"},
    {dataName : "SWIMMING", displayName:"Natation",color : "", imgRef :"./images/"},
    {dataName : "CROSSFIT", displayName:"Crossfit",color : "", imgRef :"./images/"},
    {dataName : "YOGA", displayName:"Yoga",color : "", imgRef :"./images/"},
    {dataName : "SPORT-CO", displayName:"Sport-co",color : "", imgRef :"./images/"},
    {dataName : "CLIMBING", displayName:"Escalade",color : "", imgRef :"./images/"},
    {dataName : "MARTIAL-ART", displayName:"Arts martiaux",color : "", imgRef :"./images/"},
    {dataName : "WINTER-SPORT", displayName:"Ski/Snowboard",color : "", imgRef :"./images/"},
    {dataName : "TRIATHLON", displayName:"Triathlon",color : "", imgRef :"./images/"},
    {dataName : "WATER-ACTIVITY", displayName:"Activité nautique",color : "", imgRef :"./images/"},
    {dataName : "STRETCHING", displayName:"Etirements",color : "", imgRef :"./images/"},
    {dataName : "GOLF", displayName:"Golf",color : "", imgRef :"./images/"},
    {dataName : "TENNIS", displayName:"Tennis/Badminton",color : "", imgRef :"./images/"},
    {dataName : "PATIN", displayName:"Patinage/Roller",color : "", imgRef :"./images/"}
];





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
    onChangeDisplay(["divMainBtnMenu"],["divActivityEditor"],["divHome"],[]);
};


// Genere une fausse activité pour le prototype
function onGenerateFakeActivityView() {
    document.getElementById("pInterfaceActivityTitle").innerHTML = "Editer une activité";
    document.getElementById("inputDate").value = "2024-10-12";
    document.getElementById("inputLocation").value = "PARIS";
    document.getElementById("inputDistance").value = 3.5;
    document.getElementById("inputDuration").value = "01:20:00";
    document.getElementById("textareaComment").value = "J'étais fatigué ce jour là.";
};



function onClickNewActivity() {
    document.getElementById("pInterfaceActivityTitle").innerHTML = "Créer une activité";
    document.getElementById("inputDate").value = "";
    document.getElementById("inputLocation").value = "";
    document.getElementById("inputDistance").value = "";
    document.getElementById("inputDuration").value = "";
    document.getElementById("textareaComment").value = "";

    onChangeDisplay(["divMainBtnMenu"],["divActivityEditor"],["divHome"],[]);
}






// ---------------------------------  EDITEUR d'activité ---------------------

function onClickReturnFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"]);
}

function onClickDeleteFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"]);
}

function onClickSaveFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"]);
}