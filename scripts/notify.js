
// Tableau des notifications

let notifyTextArray = {
    delete : "Activité supprimée !",
    creation : "Activité créée !",
    modification : "Activité modifiée !",
    saveprofil : "Profil sauvegardé !",
    exportSuccess : "Données exportées !",
    importSuccess : "Données importées"
};





let animationDuration = 1000;//durée de l'animation

// Popup de notification de suppression
function onShowNotifyPopup(textTarget) {

    let popup = document.getElementById("popupNotify");
    popup.innerHTML = textTarget;

    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, animationDuration); // Cache le popup après 3 secondes
};


