// Génération des options d'activité dans l'éditeur d'activité
function onGenerateActivityOptionChoice(selectorChoiceId) {

    // Traite d'abord les favoris
    if (devMode === true){console.log("Lancement de la generation des choix des activités");};

    let selectorChoiceRef = document.getElementById(selectorChoiceId);
    if (devMode === true){console.log("Reset les éléments");};
    selectorChoiceRef.innerHTML = "";

    if (devMode === true){console.log(" ajout des favoris si présent = " + userFavoris.length);};
    userFavoris.sort();

    userFavoris.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity;
        newOption.innerHTML = " * " +  activityChoiceArray[activity].displayName;
        selectorChoiceRef.appendChild(newOption);
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
        selectorChoiceRef.appendChild(newOption);
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
    let firstFavorisName = "C-A-P"; // Utilisé pour que la première activité favorite, et l'activité identique dans le reste de la liste ai le meme bouton radio


    if (devMode === true){console.log(" [FAKE SELECTOR] ajout des favoris si présent = " + userFavoris.length);};
    userFavoris.sort();

    userFavoris.forEach((e,index)=>{

        // Creation
        let newContainer = document.createElement("div");
        newContainer.classList.add("fake-opt-item-container");
        newContainer.onclick = function (event){
            event.stopPropagation();
            onChangeActivityTypeFromFakeSelect(e);
            onSetBtnRadio(e);
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
        newBtnRadioFake.id = "btnRadio-fav-" + e;
    

        // Effet bouton plein pour le premier favoris
        if (index === 0) {
            newBtnRadioFake.classList.add("selected");
            firstFavorisName = e;
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
            onSetBtnRadio(e);
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
        newBtnRadioFake.id = "btnRadio-"+e;

        // Effet bouton plein pour l'activité identique au premier favoris
        if (e === firstFavorisName) {
            newBtnRadioFake.classList.add("selected");
        }
    
        // Insertion
    
        newContainer.appendChild(newImg);
        newContainer.appendChild(newTitle);
        newContainer.appendChild(newBtnRadioFake);
    
        parentTargetRef.appendChild(newContainer);
    });


}




// Génère le prochain id pour template et activity
async function getNextIdNumber(storeTarget) {
    try {
        let counterDoc = await db.get(storeTarget);

        // Incrémenter le compteur
        counterDoc.counter += 1;

        // Mettre à jour la base
        await db.put(counterDoc);

        if (devMode === true ) {console.log(`Nouveau compteur pour ${storeTarget} :`, counterDoc.counter);};

        return counterDoc.counter; // Retourne le nouveau numéro
    } catch (err) {
        console.error("[TEMPLATE] Erreur lors de l'incrémentation du compteur :", err);
    }
}


// fonction pour retirer le bouton radio plein

function onSetBtnRadio(idTargetToAdd) {


    // Pour rechercher dans les enfants d'un parent spécifique
    let parent = document.getElementById("divFakeSelectOptList");


    // Retire les boutons radio plein
    let elementToRemoveClass = parent.querySelectorAll(".selected");
    elementToRemoveClass.forEach(e=>{
        e.classList.remove("selected");
    });
    


    // Ajoute les boutons radio plein
    let elementsToAddClass = parent.querySelectorAll(`#btnRadio-fav-${idTargetToAdd}, #btnRadio-${idTargetToAdd}`);
    elementsToAddClass.forEach(e=>{
        e.classList.add("selected");
    });

    console.log(elementsToAddClass);

    if (devMode === true) {
        console.log("[FAKE SELECT] Gestion des bouton radio");
        console.log("[FAKE SELECT] A retirer : ");
        console.log(elementToRemoveClass);
        console.log("[FAKE SELECT] A ajouter : ");
        console.log(elementsToAddClass);
    }
}



function onResetBtnRadio() {

    let idForRadio = userFavoris.length > 0 ? userFavoris[0] : "C-A-P";

     // Pour rechercher dans les enfants d'un parent spécifique
     let parent = document.getElementById("divFakeSelectOptList");


     // Retire les boutons radio plein
     let elementToRemoveClass = parent.querySelectorAll(".selected");
     elementToRemoveClass.forEach(e=>{
         e.classList.remove("selected");
     });
 
 
     // Ajoute les boutons radio plein
     let elementsToAddClass = parent.querySelectorAll(`#btnRadio-fav-${idForRadio}, #btnRadio-${idForRadio}`);
     elementsToAddClass.forEach(e=>{
         e.classList.add("selected");
     });
 
 
     if (devMode === true) {
         console.log("[FAKE SELECT] RESET des bouton radio");
         console.log("[FAKE SELECT] A retirer : ");
         console.log(elementToRemoveClass);
         console.log("[FAKE SELECT] A ajouter : ");
         console.log(elementsToAddClass);
         console.log(`les ID : #btnRadio-fav-${idForRadio}, #btnRadio-${idForRadio}`);
     }
}


// Changement de type d'activité via le fake selecteur
function onChangeActivityTypeFromFakeSelect(activityType) {

    let realSelectorTargetRef;

        // Référence les éléments cibles
    if (fakeOptionTargetMode === "activityEditor") {
        realSelectorTargetRef = document.getElementById("selectorCategoryChoice");
    } else if (fakeOptionTargetMode === "templateEditor"){
        realSelectorTargetRef = document.getElementById("selectorTemplateCategoryChoice");
    }else {
        console.log("ERREUR dans le mode du fake");
    }


    // set la nouvelle valeur dans le vrai selecteur caché
    realSelectorTargetRef.value = activityType;


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





// Gestion convertion des heures input number en mode input time

function timeFormatToInputNumber(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    return {
        hours,
        minutes,
        seconds
    };
}

// Selectionne tout le contenu lorsque je clique dans la zone de l'input
function selectAllText(input) {
    input.select();  // Sélectionner tout le texte à l'intérieur de l'input
}




// Fonction pour formater les entrées et garantir un affichage correct
function formatNumberInput(input, max, digits) {
    let value = parseInt(input.value, 10) || 0;

    // Si la valeur dépasse la valeur max autorisée, la ramener à max
    if (value > max) value = max;

    // Formater pour afficher toujours avec le bon nombre de chiffres (2 ou 3)
    input.value = value.toString().padStart(digits, '0');

    // Mettre à jour l'affichage de l'input time
}


// Empêche l'affichage du menu contextuel
function disableContextMenu(event) {
    event.preventDefault();  // Empêche l'action par défaut du clic droit
}