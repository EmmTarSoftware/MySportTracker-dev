
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







// -------------------------------------- MOBILE NOTIFICATION -------------------------------------------------------



// Gestion des éléments DOM
let pMobileNotifyStatusRef = document.getElementById("pMobileNotifyStatus"),
    rewardsKeyArrayToNotifyCue = [],//tableau vidé par la boucle de notification au fur et à mesure
    isMobileNotifyInProgress = false; // pour ne pas lancer la boucle en doublon si traitement en cours

// Vérifie si le navigateur supporte les notifications
const isNotificationSupported = () => 'Notification' in window;







// Demande l'autorisation pour les notifications
const requestNotificationPermission = async () => {

    if (devMode === true){console.log(" [NOTIFY] [MOBILE] : demande d'autorisation");};

    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        localStorage.setItem('MSS_notifyPermission', permission); // Mémorise la décision
        if (devMode === true){console.log(" [NOTIFY] [MOBILE] : enregistrement de la décision " + permission);};
        updateStatusDisplay();
        return permission;
    }
    return Notification.permission;
};


// fonction d'envoie une notification
function sendRewardMobileNotify(title, body) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(swRegistration => {
            swRegistration.showNotification(title, {
                badge :"./Icons/notifyBadge48.png",
                icon: "./Icons/Logo_MSS-192.png",
                body: body,
                vibrate: [200, 100, 200],
            });
        });
    }
};


function onReceiveNotifyMobileEvent(rewardsKeysArray) {
    if (Notification.permission === 'granted') {
        
        // Ajout des nouvelles notifications dans la file d'attente
        rewardsKeyArrayToNotifyCue.push(...rewardsKeysArray);

        // Ne lance la boucle de traitement que si elle n'est pas encours
        // Car sinon juste le fait d'alimenter l'arret ci-dessus suffit à la faire continuer son traitement
        if (!isMobileNotifyInProgress) {
            // Lancement de la boucle de traitement
            if (devMode === true){console.log(" [NOTIFY] [MOBILE] Lancement de la boucle de traitement. Activation du boolean");};
            isMobileNotifyInProgress = true;
            onTraiteMobileNotify(); 
        }
        

    } else if (Notification.permission === 'denied') {
        if (devMode === true){console.log(" [NOTIFY] [MOBILE] Notification NON autorisées ! ");};
        return
    } else{
        eventFirstMobileNotify(rewardsKeysArray);
    }
};



// première notification mobile
const eventFirstMobileNotify = async (rewardsKeysArray) => {

    if (devMode === true){console.log(" [NOTIFY] [MOBILE] première notication.");};

    // Première récompense
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
        // Ajout des nouvelles notifications dans la file d'attente
        rewardsKeyArrayToNotifyCue.push(...rewardsKeysArray);
        if (devMode === true){console.log(" [NOTIFY] [MOBILE] Lancement de la boucle de traitement. Activation du boolean");};
        isMobileNotifyInProgress = true;
        onTraiteMobileNotify();
    }
};




function onTraiteMobileNotify() {
    // index zero de la file d'attente
    let rewardKey = rewardsKeyArrayToNotifyCue[0];

    sendRewardMobileNotify(allRewardsObject[rewardKey].activityName, allRewardsObject[rewardKey].title);

    // Retire l'index zero de la file d'attente
    rewardsKeyArrayToNotifyCue.shift();

    if (devMode === true){
        console.log("[NOTIFY] [MOBILE] Traitement pour " + rewardKey);
        console.log("[NOTIFY] [MOBILE] File d'attente :" + rewardsKeyArrayToNotifyCue);
    };
    

    setTimeout(() => {
        if (rewardsKeyArrayToNotifyCue.length > 0) {            
            onTraiteMobileNotify();
        } else {
            if (devMode === true){console.log("[NOTIFY] [MOBILE] fin de traitement. Libération du boolean");};
            isMobileNotifyInProgress = false;
        }
    }, 2000);
}



// Verification des notifications mobile au démarrage
function onInitMobileNotify() {
    if (devMode === true){console.log("[NOTIFY] [MOBILE] Initialisation du statut");};
    if (!isNotificationSupported()) {
        pMobileNotifyStatusRef.innerHTML = 'Notifications : Non supportées par ce navigateur';
        return;
    }

    // Vérifie l'état actuel et met à jour l'affichage
    const savedPermission = localStorage.getItem('MSS_notifyPermission');
    if (savedPermission) {
        Notification.permission = savedPermission; // Pour l'affichage uniquement
    }
    if (devMode === true){console.log("[NOTIFY] [MOBILE] valeur enregistrée : " + savedPermission);};
    updateStatusDisplay();

};


// Met à jour l'état affiché à l'utilisateur
function updateStatusDisplay (){
    const permission = Notification.permission;
    if (devMode === true){console.log("[NOTIFY] [MOBILE] valeur Notification.permission : " + permission);};

    if (permission === 'granted') {
        pMobileNotifyStatusRef.innerHTML = 'Activées';
    } else if (permission === 'denied') {
        pMobileNotifyStatusRef.innerHTML = 'Refusées';
    } else {
        pMobileNotifyStatusRef.innerHTML = 'Non configurées';
    }
};








onInitMobileNotify();
