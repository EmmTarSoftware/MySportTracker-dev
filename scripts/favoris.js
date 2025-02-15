
function onOpenMenuFavoris() {

    // Chargement de la liste des activité pour visualisation
    onLoadingActivityList();
};


// Fonction de chargement de la liste d'activité

function onLoadingActivityList() {
    let ulActivityListParentRef = document.getElementById("ulActivityListParent");

    // Trie la liste des activités par ordre alpha
    let filteredKeyActivityList = Object.keys(activityChoiceArray);
    filteredKeyActivityList.sort();



    filteredKeyActivityList.forEach(e=>{

        // Création
        let newLi = document.createElement("li");
        newLi.classList.add("favoris-list");

        let newActivityName = document.createElement("p");
        newActivityName.innerHTML =  activityChoiceArray[e].displayName;
        newActivityName.classList.add("favoris-list");

        let newActivityImg = document.createElement("img");
        newActivityImg.src = activityChoiceArray[e].imgRef;
        newActivityImg.classList.add("favoris-list");



        // Favoris
        let newFavorisImg = document.createElement("img");
        newFavorisImg.src = onSearchActivityInUserFavoris(e) ? "./Icons/Icon-Favoris-Sel.webp" : "./Icons/Icon-Favoris.webp";
        newFavorisImg.classList.add("favoris");




        newFavorisImg.onclick = function (){
            onChangeFavorisStatus(this,e); 
        };

        // Insertion
        newLi.appendChild(newActivityImg);
        newLi.appendChild(newActivityName);
        newLi.appendChild(newFavorisImg);

        ulActivityListParentRef.appendChild(newLi);

    });
};



// Retour depuis Favoris
function onClickReturnFromFavoris() {
    // Vide la liste :
    document.getElementById("ulActivityListParent").innerHTML = "";

    // ferme le menu
    onLeaveMenu("Favoris");
};






// Creation du tableau des favoris
let userFavoris = [];



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
    eventSaveFavoris(userFavoris);
    
    if (devMode === true){
        console.log("[FAVORIS] tableau des favoris =   ");
        console.log(userFavoris);
    };

};



async function eventSaveFavoris(newFavorisList) {
    await onInsertFavorisModificationInDB(newFavorisList);

    // Remet à jour les options de choix
    onGenerateActivityOptionChoice("selectorCategoryChoice");
    onGenerateFakeOptionList("divFakeSelectOptList");

}


// Modification des favoris
async function onInsertFavorisModificationInDB(newFavorisList) {
    try {
        // Récupérer le store "favoris"
        let favorisStore = await db.get(favorisStoreName);

        // Mettre à jour la liste des favoris
        favorisStore.favorisList = newFavorisList;

        // Sauvegarder les modifications
        await db.put(favorisStore);

        if (devMode) console.log("Store FAVORIS mis à jour :", favorisStore);
        return true; // Indique que la mise à jour est réussie
    } catch (err) {
        console.error("Erreur lors de la mise à jour du store FAVORIS :", err);
        return false; // Indique une erreur
    }
}



// Fonction de recherche de la présence d'une activité dans le tableau des favoris

function onSearchActivityInUserFavoris(favorisDataName) {
        return userFavoris.includes(favorisDataName);
};