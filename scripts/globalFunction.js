// Génération des options d'activité dans l'éditeur d'activité
function onGenerateActivityOptionChoice(selectorChoiceId) {

    // Traite d'abord les favoris
    if (devMode === true){console.log("Lancement de la generation des choix des activités");};

    let selectorRef = document.getElementById(selectorChoiceId);
    if (devMode === true){console.log("Reset les éléments");};
    selectorRef.innerHTML = "";

    if (devMode === true){console.log(" ajout des favoris si présent = " + userFavoris.length);};
    userFavoris.sort();

    userFavoris.forEach(activity => {

        let newOption = document.createElement("option");
        newOption.value = activity;
        newOption.innerHTML = " * " +  activityChoiceArray[activity].displayName;
        selectorRef.appendChild(newOption);
        if (devMode === true){console.log("ajout de l'option" + activityChoiceArray[activity].displayName );};
    });


    // Trier le tableau par ordre alphabétique 
    let activitySortedKey = Object.keys(activityChoiceArray);
    activitySortedKey.sort();

    // Ajouter les autres options triées
    activitySortedKey.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity;
        newOption.innerHTML = activityChoiceArray[activity].displayName;
        selectorRef.appendChild(newOption);
    });

};


let fakeOptionTargetMode = "";//pour connaitre à quel système s'addresse le fake selecteur (activityEditor ou templateEditor)


function onGenerateFakeOptionList(idParentTarget) {
    let parentTargetRef = document.getElementById(idParentTarget);

    // Traite d'abord les favoris
    if (devMode === true){
        console.log("[FAKE SELECTOR]Lancement de la generation des choix des activités");
        console.log("[FAKE SELECTOR] ID Parent pour insertion : " + parentTargetRef);
    };

    parentTargetRef.innerHTML = "";

    if (devMode === true){console.log(" [FAKE SELECTOR] ajout des favoris si présent = " + userFavoris.length);};
    userFavoris.sort();

    userFavoris.forEach((e,index)=>{

        // Creation
        let newContainer = document.createElement("div");
        newContainer.classList.add("fake-opt-item-container");
        newContainer.onclick = function (event){
            event.stopPropagation();
            onChangeActivityTypeFromFakeSelect(e,selectorCategoryChoiceRef,fakeSelectorActivityEditorTextRef);
        }
    
        // Style sans border botton pour le dernier
        if (index === (userFavoris.length - 1)) {
            newContainer.classList.add("fake-opt-item-last-favourite");
        }
        
        let newFavoriteSymbol = document.createElement("span");
        newFavoriteSymbol.innerHTML = "*";
        newFavoriteSymbol.classList.add("favouriteSymbol");


        let newImg = document.createElement("img");
        newImg.classList.add("fake-opt-item");
        newImg.src = activityChoiceArray[e].imgRef;
    
        let newTitle = document.createElement("span");
        newTitle.innerHTML = activityChoiceArray[e].displayName;
        newTitle.classList.add("fake-opt-item","fake-opt-item-favoris");
    
    
        // Bouton radio fake pour simuler le selecteur
        let newBtnRadioFake = document.createElement("div");
        newBtnRadioFake.classList.add("radio-button-fake");
    
        // Effet bouton plein pour le premier item de la liste
        if (index === 0) {
            newBtnRadioFake.classList.add("selected");
        }
    
        // Insertion
        newContainer.appendChild(newFavoriteSymbol);
        newContainer.appendChild(newImg);
        newContainer.appendChild(newTitle);
        newContainer.appendChild(newBtnRadioFake);
    
        parentTargetRef.appendChild(newContainer);
    });


    if (devMode === true){console.log(" [FAKE SELECTOR] ajout du reste des types d'activités")};

    // Puis toutes les type d'activités
    let activitySortedKey = Object.keys(activityChoiceArray);
    activitySortedKey.sort();


    activitySortedKey.forEach((e,index)=>{

        // Creation
        let newContainer = document.createElement("div");
        newContainer.classList.add("fake-opt-item-container");
        newContainer.onclick = function (event){
            event.stopPropagation();
            onChangeActivityTypeFromFakeSelect(e);
        }
    
        // Style sans border botton pour le dernier
        if (index === (activitySortedKey.length - 1)) {
            newContainer.classList.add("fake-opt-item-last-container");
        }
      
        let newImg = document.createElement("img");
        newImg.classList.add("fake-opt-item");
        newImg.src = activityChoiceArray[e].imgRef;
    
        let newTitle = document.createElement("span");
        newTitle.innerHTML = activityChoiceArray[e].displayName;
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
    
        parentTargetRef.appendChild(newContainer);
    });


}



// Changement de type d'activité via le fake selecteur
function onChangeActivityTypeFromFakeSelect(activityType) {

    let realSelectorTargetRef,
        fakeSelectorTargetRef;

        // Référence les éléments cibles
    if (fakeOptionTargetMode === "activityEditor") {
        realSelectorTargetRef = document.getElementById("selectorCategoryChoice");
        fakeSelectorTargetRef = document.getElementById("fakeSelectorActivityEditorText");
    } else if (fakeOptionTargetMode === "templateEditor"){
        realSelectorTargetRef = document.getElementById("selectorTemplateCategoryChoice");
        fakeSelectorTargetRef = document.getElementById("fakeSelectorTemplateEditorText");
    }else {
        console.log("ERREUR dans le mode du fake");
    }


    // set la nouvelle valeur dans le vrai selecteur caché
    realSelectorTargetRef.value = activityType;

    // Ainsi que dans le fake selecteur
    fakeSelectorTargetRef.innerHTML = activityChoiceArray[activityType].displayName;


    // set l'image de prévisualisation
    if (fakeOptionTargetMode === "activityEditor") {
        onChangeActivityPreview(activityType);
    } else if (fakeOptionTargetMode === "templateEditor"){
        onChangeTemplatePreview(activityType);
    }else {
        console.log("ERREUR dans le mode du fake");
    }



    // ferme le fake option
    onCloseFakeSelectOpt();

}


// Clique sur le fake selecteur
function onClickFakeSelect(MenuTarget){


    //set le mode d'ouverture du fake selecteur. Pour activityEditor ou templateEditor
    fakeOptionTargetMode = MenuTarget;

    // Affiche le fake option
    document.getElementById("divFakeSelectOpt").style.display = "flex";

}


function onCloseFakeSelectOpt(event){
    document.getElementById("divFakeSelectOpt").style.display = "none";
}










// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplayBlock,toDisplayFlex,toDisable,toEnable,visibilityOFF,visibilityON) {
    // Cache les items
    toHide.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to hide : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items en block
    toDisplayBlock.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to display bloc : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });

     // Affiche les items en flex
     toDisplayFlex.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to display flex : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.display = "flex";
    });


    // Desactive les items
    toDisable.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to disable : " + id);};
       let itemRef = document.getElementById(id);
       itemRef.style.opacity = 0.1;
       itemRef.style.pointerEvents = "none";
    });

    // Active les items
    toEnable.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to enable : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.opacity = 1;
        itemRef.style.pointerEvents = "all";
    });



    // Visibilité OFF pour les items
    visibilityOFF.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to VISIBILITY OFF : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "hidden";
    });

    // Visibilité ON pour les items
    visibilityON.forEach(id=>{
        if (devMode === true) {console.log("[NAVIGATION] to visibility ON : " + id);};
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "visible";
    });


};


// retourne une l'heure actuel au format 00:00
function onGetCurrentTime() {
    let currentTime = new Date();

    let formatedHours = currentTime.getHours() > 9 ? currentTime.getHours() : "0" + currentTime.getHours() ;
    let formatedMinutes = currentTime.getMinutes() > 9 ? currentTime.getMinutes() : "0" + currentTime.getMinutes();

    return `${formatedHours}:${formatedMinutes}`;
}





// Récupère les date du jours et de la veille

function onFindDateTodayUS() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

// La date d'hier
function onFindDateYesterdayUS() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Soustrait un jour à la date actuelle
    
    let year = yesterday.getFullYear();
    let month = String(yesterday.getMonth() + 1).padStart(2, '0');
    let day = String(yesterday.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};






//formatage =  tout en majuscule
function onSetToUppercase(e) {
    let upperCase = e.toUpperCase();
    return upperCase;
};

// detection des champs vides obligatoires
function onCheckEmptyField(e) {
    if (e === "") {
        if (devMode === true){console.log("Champ vide obligatoire détecté !");};
    };
    return e === ""? true :false;
};









// Conversion du format time en seconde
function onConvertTimeToSecond(stringValue) {
    let [hours, minutes, seconds] = stringValue.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};


// Convertion des dates stocké en US vers le format FR

function onFormatDateToFr(dateString) {
    // Créer un objet Date en analysant la chaîne de date
    let date = new Date(dateString);

    // Obtenir les composants de la date
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois vont de 0 à 11, donc ajouter 1
    let year = date.getFullYear();

    // Obtenir l'année actuelle
    let currentYear = new Date().getFullYear();

    // Tableau des noms de mois en français
    const montName = ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

    if (year === currentYear) {
        // Si l'année est l'année en cours, retourner le format "day mois"
        return `${day} ${montName[month - 1]}`;
    } else {
        // Sinon, retourner le format "jj-mm-aa"
        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;

        let year2Digits = year % 100; // Obtenir les deux derniers chiffres de l'année
        year2Digits = (year2Digits < 10) ? '0' + year2Digits : year2Digits;

        return `${day}-${month}-${year2Digits}`;
    }
};





// si la date en entre est après la date du jour
function isDateAfterToday(inputDate) {
    // Crée une nouvelle instance de la date actuelle
    const today = new Date();

    // Crée une instance de la date d'entrée
    const dateToCompare = new Date(inputDate);

    // Compare les dates : retourne true si la date entrée est après aujourd'hui
    //ATTENTION : "Aujourd'hui" comment à partir d'1 heure du matin pour l'application
    return dateToCompare > today;
}






