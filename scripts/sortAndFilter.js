
// Référencement des icones de tries

let btnSortDistanceRef = document.getElementById("btnSortDistance"),
    btnSortDuration = document.getElementById("btnSortDuration"),
    btnSortDate = document.getElementById("btnSortDate");


// Remet les tries et filtres par défaut
function onResetSortAndFilter(){
    if (devMode === true){console.log("Réinitialiser les filtres et trie par défaut");};

    currentFilter = defaultFilter;
    currentSortType = "dateRecente";

};


// Set les icones de trie selon le trie en cours
function onSetIconSort() {

    if (devMode === true){console.log("modifie de style des icones de filtre");};
    
    // Bouton de tri par distance
    if (currentSortType === "distanceCroissante" || currentSortType === "distanceDecroissante") {
        btnSortDistanceRef.classList.add("btn-sort-Selected");
        btnSortDistanceRef.classList.remove("btn-sort");
    } else {
        btnSortDistanceRef.classList.add("btn-sort");
        btnSortDistanceRef.classList.remove("btn-sort-Selected");
    }

    // Bouton de tri par durée
    if (currentSortType === "chronoCroissant" || currentSortType === "chronoDecroissant") {
        btnSortDuration.classList.add("btn-sort-Selected");
        btnSortDuration.classList.remove("btn-sort");
    } else {
        btnSortDuration.classList.add("btn-sort");
        btnSortDuration.classList.remove("btn-sort-Selected");
    }

    // Bouton de tri par date
    if (currentSortType === "dateRecente" || currentSortType === "dateAncienne") {
        btnSortDate.classList.add("btn-sort-Selected");
        btnSortDate.classList.remove("btn-sort");
    } else {
        btnSortDate.classList.add("btn-sort");
        btnSortDate.classList.remove("btn-sort-Selected");
    }



};


//---------------------------------------- LES FILTRES ----------------------------





//  variable et referencement
let defaultFilter = "ALL",
    currentFilter = defaultFilter, // le type de filtre en cours
    selectorRef = document.getElementById("selectorCategoryFilter");



// Génération du filtre sur les catégorie d'activité
function onGenerateDynamiqueFilter(allData) {
    
    let dynamicFilterList = [];


    // Recupère les nouvelle catégorie présente dans la liste en cours
    allData.forEach(data=>{
        if (!dynamicFilterList.includes(data.name))  {
            dynamicFilterList.push(data.name);
        };
    });

    dynamicFilterList.sort();

    if (devMode === true){
        console.log("[ TRIE] valeur de dynamicFilterList = " );
        console.log(dynamicFilterList);
    };

    // Crée les options dans le selection pour les catégorie
    onGenerateActivityOptionFilter(dynamicFilterList);
};



// Génération des options d'activité pour le filtre avec tri
function onGenerateActivityOptionFilter(allActivityData) {


    selectorRef.innerHTML = "";


    // Ajouter l'option "Tous" au début
    let allOption = document.createElement("option");
    allOption.value = "ALL";
    allOption.innerHTML = "Tous";
    selectorRef.appendChild(allOption);

    // Ajouter l'option "Planifiées" juste après
    let plannedOption = document.createElement("option");
    plannedOption.value = "PLANNED";
    plannedOption.innerHTML = "Planifiées";
    selectorRef.appendChild(plannedOption);


    // Ajouter les autres options des activités existantes triées
    allActivityData.forEach(activity => {
        let newOption = document.createElement("option");
        newOption.value = activity;
        newOption.innerHTML = activityChoiceArray[activity].displayName;
        selectorRef.appendChild(newOption);
    });


};


// Fonction de filtre de l'affichage des activité

function onFilterActivity(sortType,filterType,activityArray) {


    if (devMode === true){
        console.log("fonction de filtre sur activité");
        console.log("type de trie = " + sortType + " type de filtre = " + filterType);
    };

    let allDataFiltered = [];


    // si le filtre est réglé sur "tous" affiche tous
    if (filterType === defaultFilter) {
        // Insertion de tous les activités dans la liste


        if (devMode === true){console.log("Demande de trie sur toutes les données");};
        onSortActivity(sortType,activityArray);

    } else if (filterType === "PLANNED"){
        if (devMode === true){console.log("Demande de filtre sur les activités planifiées");};

        allDataFiltered = allUserActivityArray.filter(item =>{
            return item.isPlanned === true;
        });
        onSortActivity(sortType,allDataFiltered);

    } else {

        allDataFiltered = allUserActivityArray.filter(item =>{
            return item.name === filterType;
        });
        if (devMode === true){console.log("Demande de trie sur les données filtré");};
        // Lance le trie uniquement sur les éléments filtré
        onSortActivity(sortType,allDataFiltered);

    };


};




// Changement du filtre via action de l'utilisateur
function onChangeSelectorFilter(){

    if (devMode === true){console.log("changement de selecteur du filtre pour = " + selectorRef.value);};
    currentFilter = selectorRef.value;

    onFilterActivity(currentSortType,currentFilter,allUserActivityArray);
};








// --------------------------------------- les TRIES  ----------------------------------------






let currentSortType = "dateRecente";

// Fonction de selecteur de trie personnalisé (appelé depuis l'utilisateur)
function onUserChangeSortType(sortCategory) {
    if (devMode === true){console.log("type de trie précédent : "+ currentSortType);};


    switch (sortCategory) {


        case "date":
            if (currentSortType === "dateRecente") {
                currentSortType = "dateAncienne";
            }else{
                currentSortType = "dateRecente";
            };
        break;
        case "duration":
            if (currentSortType === "chronoCroissant") {
                currentSortType = "chronoDecroissant";
            }else{
                currentSortType = "chronoCroissant";
            };
        break;
        case "distance":
            if (currentSortType === "distanceCroissante"){
                currentSortType = "distanceDecroissante";
            }else{
                currentSortType = "distanceCroissante";               
            };
        break;
    
        default:
            console.log("erreur lors du changement de categorie de trie");
        break;
    };


    if (devMode === true){console.log(`Changement du type de trie sur ${sortCategory}  pour ${currentSortType}`);};




    onFilterActivity(currentSortType,currentFilter,allUserActivityArray);


};






// Fonction du trie
function onSortActivity(sortType,filteredData) {

    if (devMode === true){console.log("Demande de trie par : " + sortType );};

    if (sortType === "dateRecente") {
        filteredData.sort((a, b) => {
            const dateDiff = new Date(b.date) - new Date(a.date);
            if (dateDiff !== 0) {
                return dateDiff; // Tri par date décroissante
            }
            return b.key - a.key; // Si les dates sont identiques, les activités créés en dernier (key la plus élevé) apparaitrons en premiers
        });
    } else if (sortType === "dateAncienne") {
        filteredData.sort((a, b) => {
            const dateDiff = new Date(a.date) - new Date(b.date);
            if (dateDiff !== 0) {
                return dateDiff; // Tri par date croissante
            }
            return a.key - b.key; // Si les dates sont identiques, les activités créés en dernier (key la plus élevé) apparaitrons en derniers
        });
    }else if (sortType === "distanceCroissante") {
        filteredData.sort((a, b) => a.distance - b.distance); // Tri par distance croissante
    }else if (sortType === "distanceDecroissante") {
        filteredData.sort((a, b) => b.distance - a.distance); // Tri par distance décroissante
    }else if (sortType === "chronoCroissant") {
        filteredData.sort((a, b) => onConvertTimeToSecond(a.duration) - onConvertTimeToSecond(b.duration)); // Tri par distance croissante
    }else if (sortType === "chronoDecroissant") {
        filteredData.sort((a, b) => onConvertTimeToSecond(b.duration) - onConvertTimeToSecond(a.duration)); // Tri par distance décroissante
    };


    // Mettre à jour le style également

    if (devMode === true){console.log("appel la fonction de trie");};
    onSetIconSort();



    // Insert uniquement les activités du filtre
    onInsertActivityInList(filteredData);
};




