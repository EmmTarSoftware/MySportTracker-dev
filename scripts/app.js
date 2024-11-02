// Variable globales







// NAVIGATION DANS LES MENUS 


let oldMenuSelected = "Accueil";

function onChangeMenu(menuTarget) {

    console.log(" [ NAVIGATION ] Demande de changement menu : " + menuTarget);
    
    if (menuTarget != oldMenuSelected) {
        
        // Action sur l'ancien menu sélectionné
        switch (oldMenuSelected) {
            case "Accueil":
                console.log("[ NAVIGATION ] Traitement ancien menu : Accueil");

                onChangeDisplay(["divHome","divActivityEditor"],[],[],[]);
            break;
            case "Profil":
                console.log("[ NAVIGATION ] Traitement ancien menu : Profil");

                onChangeDisplay(["divProfil"],[],[],[]);
            break;
            default:
                console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour l'ancien menu");
            break;
        };

        
        // Action sur le nouveau menu sélectionné
        oldMenuSelected = menuTarget;

        switch (menuTarget) {
            case "Accueil":
                console.log("[ NAVIGATION ] Traitement pour nouveau menu : Accueil");
                onChangeDisplay([],["divHome"],[],["divHome"]);
            break;
            case "Profil":
                console.log("[ NAVIGATION ] Traitement pour nouveau menu : Profil");
                onChangeDisplay([],["divProfil"],[],[]);
            break;
            default:
                console.log("[ NAVIGATION ] Erreur : Aucune correspondance pour le nouveau menu");
            break;
        };


    }else{
        console.log("[ NAVIGATION ] Aucune action : menu déjà sélectionné");
    };


};






// fonction de gestion de l'affichage
function onChangeDisplay(toHide,toDisplay,toDisable,toEnable) {
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


};




