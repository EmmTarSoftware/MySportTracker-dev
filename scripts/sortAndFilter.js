
// Référencement des icones de tries

let btnSortDistanceRef = document.getElementById("btnSortDistance"),
    btnSortDuration = document.getElementById("btnSortDuration"),
    btnSortDate = document.getElementById("btnSortDate");


// Remet les tries et filtres par défaut
function onResetSortAndFilter(){
    console.log("Réinitialiser les filtres et trie par défaut");

    currentFilter = defaultFilter;
    currentSortType = "dateRecente";

};


// Set les icones de trie selon le trie en cours
function onSetIconSort() {

    console.log("modifie de style des icones de filtre");

    btnSortDistanceRef.className = currentSortType === "distanceCroissante"  || currentSortType === "distanceDecroissante"? "btn-sort-Selected" : "btn-sort";
    btnSortDuration.className = currentSortType === "chronoCroissant"  || currentSortType === "chronoDecroissant"? "btn-sort-Selected" : "btn-sort";
    btnSortDate.className = currentSortType === "dateRecente"  || currentSortType === "dateAncienne"? "btn-sort-Selected" : "btn-sort";


};


//---------------------------------------- LES FILTRES ----------------------------





//  variable et referencement
let defaultFilter = "ALL",
    currentFilter = defaultFilter, // le type de filtre en cours
    selectorRef = document.getElementById("selectorCategoryFilter");




function onGenerateDynamiqueFilter(allData) {
    
    let dynamicFilterList = [];


    // Recupère les nouvelle catégorie présente dans la liste en cours
    allData.forEach(data=>{
        if (!dynamicFilterList.includes(data.name))  {
            dynamicFilterList.push(data.name);
        };
    });

    dynamicFilterList.sort();

    console.log("[ TRIE] valeur de dynamicFilterList = " );
    console.log(dynamicFilterList);


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



    // Ajouter les autres options triées
    allActivityData.forEach(activity => {

        // extraite tous les éléments de l'objet du tableau
        let currentObject = getActivityArrayRefByDataName(activity);

        let newOption = document.createElement("option");
        newOption.value = currentObject.dataName;
        newOption.innerHTML = currentObject.displayName;
        selectorRef.appendChild(newOption);
    });

};


// Fonction de filtre de l'affichage des activité

function onFilterActivity(sortType,filterType,activityArray) {

    console.log("fonction de filtre sur activité");
    console.log("type de trie = " + sortType + " type de filtre = " + filterType);

    let allDataFiltered = [];


    // si le filtre est réglé sur "tous" affiche tous
    if (filterType === defaultFilter) {
        // Insertion de tous les activités dans la liste

        console.log("Demande de trie sur toutes les données");
        onSortActivity(sortType,activityArray);
    }else{

        allDataFiltered = allActivityArray.filter(item =>{
            return item.name === filterType;
        });
        console.log("Demande de trie sur les données filtré");
        // Lance le trie uniquement sur les éléments filtré
        onSortActivity(sortType,allDataFiltered);

    };


};




// Changement du filtre via action de l'utilisateur
function onChangeSelectorFilter(){
    console.log("changement de selecteur du filtre pour = " + selectorRef.value);
    currentFilter = selectorRef.value;

    onFilterActivity(currentSortType,currentFilter,allActivityArray);
};








// --------------------------------------- les TRIES  ----------------------------------------






let currentSortType = "dateRecente";

// Fonction de selecteur de trie personnalisé (appelé depuis l'utilisateur)
function onUserChangeSortType(sortCategory) {
    console.log("type de trie précédent : "+ currentSortType);


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


    console.log(`Changement du type de trie sur ${sortCategory}  pour ${currentSortType}`);




    onFilterActivity(currentSortType,currentFilter,allActivityArray);


};


function onSortActivity(sortType,filteredData) {


    console.log("Demande de trie par : " + sortType );


    if (sortType === "dateRecente") {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante
    }else if (sortType === "dateAncienne") {
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Tri par date croissante
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

    console.log("appel la fonction de trie");
    onSetIconSort();



    // Insert uniquement les activités du filtre
    onInsertActivityInList(filteredData);
};




