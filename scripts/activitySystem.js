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
    document.getElementById("inputDuration").value = "00:00:00";
    document.getElementById("textareaComment").value = "";

    onChangeDisplay(["divMainBtnMenu" ],["divActivityEditor"],["divHome"],[],["btnDeleteActivity"],[]);
};






// ---------------------------------  EDITEUR d'activité ---------------------

function onClickReturnFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
};

function onClickDeleteFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
};

function onClickSaveFromActivityEditor() {
    onChangeDisplay(["divActivityEditor"],["divMainBtnMenu"],[],["divHome"],[],[]);
};