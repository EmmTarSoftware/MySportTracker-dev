
function onOpenMenuFavoris() {

    // Chargement de la liste des activité pour visualisation
    onLoadingActivityList();
};


// Fonction de chargement de la liste d'activité

function onLoadingActivityList() {
    let ulActivityListParentRef = document.getElementById("ulActivityListParent");

    for (let [activitiesKeys, activityData] of Object.entries(activityChoiceArray)) {

        // Création
        let newLi = document.createElement("li");
        newLi.className = "favoris-list";

        let newActivityName = document.createElement("p");
        newActivityName.innerHTML =  activityData.displayName;
        newActivityName.className = "favoris-list";

        let newActivityImg = document.createElement("img");
        newActivityImg.src = activityData.imgRef;
        newActivityImg.className = "favoris-list";



        // Favoris
        let newFavorisImg = document.createElement("img");
        newFavorisImg.src = onSearchActivityInUserFavoris(activitiesKeys) ? "./Icons/Icon-Favoris-Sel.webp" : "./Icons/Icon-Favoris.webp";
        newFavorisImg.className = "favoris";




        newFavorisImg.onclick = function (){
            onChangeFavorisStatus(this,activitiesKeys); 
        };

        // Insertion
        newLi.appendChild(newActivityImg);
        newLi.appendChild(newActivityName);
        newLi.appendChild(newFavorisImg);

        ulActivityListParentRef.appendChild(newLi);

    };
};



// Retour depuis Favoris
function onClickReturnFromFavoris() {
    // Vide la liste :
    document.getElementById("ulActivityListParent").innerHTML = "";

    // ferme le menu
    onLeaveMenu("Favoris");
};






// Creation du tableau des favoris
let userFavoris = [],
    cookiesUserFavorisName = "MonSuivitSportif-userFavoris";

// Vérification de l'engeristrement des favoris en local storage

function onCheckFavorisInLocalStorage() {
    if (devMode === true){console.log("[FAVORIS] vérification de l'existance du cookies des favoris ");};

    if (localStorage.getItem(cookiesUserFavorisName) === null){
        localStorage.setItem(cookiesUserFavorisName, JSON.stringify(userFavoris));
        if (devMode === true){console.log("[FAVORIS] Creation du cookies :  " + cookiesUserFavorisName);};
    }else{
        if (devMode === true){console.log("[FAVORIS] cookies existants, changement dans le tableau = ");};
        userFavoris = JSON.parse(localStorage.getItem(cookiesUserFavorisName));
        if (devMode === true){console.log(userFavoris);};
    };

};

onCheckFavorisInLocalStorage();




// Fonction de changement d'état d'un favoris
function onChangeFavorisStatus(imgTarget,favorisDataName) {


    // Si le favoris n'existe pas, le créé change l'image. et inversement
    if (userFavoris.includes(favorisDataName)) {
        let indexToRemove = userFavoris.indexOf(favorisDataName);
        userFavoris.splice(indexToRemove,1);
        if (devMode === true){console.log("[FAVORIS] Suppression de l'élément =  " + favorisDataName);};

        imgTarget.src = "./Icons/Icon-Favoris.webp";
    }else{
        userFavoris.push(favorisDataName);
        if (devMode === true){console.log("[FAVORIS] Ajout de l'élément =  " + favorisDataName);};

        imgTarget.src = "./Icons/Icon-Favoris-Sel.webp";
    };
    
    // Sauvegarde du nouvel état
    onSaveFavorisInLocalStorage();

    // Remet à jour les options de choix
    onGenerateActivityOptionChoice();

    if (devMode === true){
        console.log("[FAVORIS] tableau des favoris =   ");
        console.log(userFavoris);
    };

};





// Fonction de sauvegarde des favoris dans le local storage
function onSaveFavorisInLocalStorage() {
    if (devMode === true){console.log("[FAVORIS] enregistrement du nouvel état du tableau");};
    localStorage.setItem(cookiesUserFavorisName, JSON.stringify(userFavoris));
};




// Fonction de recherche de la présence d'une activité dans le tableau des favoris

function onSearchActivityInUserFavoris(favorisDataName) {
        return userFavoris.includes(favorisDataName);
};