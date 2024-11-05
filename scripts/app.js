// Variable globales







// NAVIGATION DANS LES MENUS 


function onChangeMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);


    switch (menuTarget) {
        case "Profil":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Profil");
            onChangeDisplay(["divMainBtnMenu","divHome"],["divProfil"],[],[],[],[]);
            onOpenMenuProfil();
        break;
        case "Info":
            console.log("[ NAVIGATION ] Traitement pour nouveau menu : Info");
            onChangeDisplay(["divMainBtnMenu","divHome"],["divInfo"],[],[],[],[]);
            onOpenMenuInfo();
        break;
        default:
            console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu");
        break;
    };

};






// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplay,toDisable,toEnable,visibilityOFF,visibilityON) {
    // Cache les items
    toHide.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "none";
    });

    // Affiche les items
    toDisplay.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.display = "block";
    });


    // Desactive les items
    toDisable.forEach(id=>{
       let itemRef = document.getElementById(id);
       itemRef.style.opacity = 0.1;
       itemRef.style.pointerEvents = "none";
    });

    // Active les items
    toEnable.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.opacity = 1;
        itemRef.style.pointerEvents = "all";
    });



    // Visibilité OFF pour les items
    visibilityOFF.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "hidden";
    });

    // Visibilité ON pour les items
    visibilityON.forEach(id=>{
        let itemRef = document.getElementById(id);
        itemRef.style.visibility = "visible";
    });


};




