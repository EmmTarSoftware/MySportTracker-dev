// Creation du tableau des favoris
let userFavoris = [],
    cookiesUserFavorisName = "MonSuivitSportif-userFavoris";

// Vérification de l'engeristrement des favoris en local storage

function onCheckFavorisInLocalStorage() {
    console.log("[FAVORIS] vérification de l'existance du cookies des favoris ");

    if (localStorage.getItem(cookiesUserFavorisName) === null){
        localStorage.setItem(cookiesUserFavorisName, JSON.stringify(userFavoris));
        console.log("[FAVORIS] Creation du cookies :  " + cookiesUserFavorisName);
    }else{
        console.log("[FAVORIS] cookies existants, changement dans le tableau = ");
        userFavoris = JSON.parse(localStorage.getItem(cookiesUserFavorisName));
        console.log(userFavoris);
    };

};

onCheckFavorisInLocalStorage();




// Fonction de changement d'état d'un favoris
function onChangeFavorisStatus(imgTarget,favorisDataName) {


    // Si le favoris n'existe pas, le créé change l'image. et inversement
    if (userFavoris.includes(favorisDataName)) {
        let indexToRemove = userFavoris.indexOf(favorisDataName);
        userFavoris.splice(indexToRemove,1);
        console.log("[FAVORIS] Suppression de l'élément =  " + favorisDataName);
        imgTarget.src = "./Icons/Icon-Favoris.png";
    }else{
        userFavoris.push(favorisDataName);
        console.log("[FAVORIS] Ajout de l'élément =  " + favorisDataName);
        imgTarget.src = "./Icons/Icon-Favoris-Sel.png";
    };
    
    // Sauvegarde du nouvel état
    onSaveFavorisInLocalStorage();

    // Remet à jour les options de choix
    onGenerateActivityOptionChoice();

    console.log("[FAVORIS] tableau des favoris =   ");
    console.log(userFavoris);

};





// Fonction de sauvegarde des favoris dans le local storage
function onSaveFavorisInLocalStorage() {
    console.log("[FAVORIS] enregistrement du nouvel état du tableau");
    localStorage.setItem(cookiesUserFavorisName, JSON.stringify(userFavoris));
};




// Fonction de recherche de la présence d'une activité dans le tableau des favoris

function onSearchActivityInUserFavoris(favorisDataName) {
        return userFavoris.includes(favorisDataName);
}