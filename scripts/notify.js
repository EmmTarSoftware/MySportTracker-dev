

let animationDuration = 1000;//durée de l'animation

// Popup de notification de suppression
function onShowNotifyPopup() {
    let popup = document.getElementById("popupNotify");
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, animationDuration); // Cache le popup après 3 secondes
};


