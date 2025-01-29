

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






