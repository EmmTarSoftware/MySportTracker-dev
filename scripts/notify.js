
// Tableau des notifications

let notifyTextArray = {
    delete : "Activité supprimée !",
    creation : "Activité créée !",
    modification : "Activité modifiée !",
    saveprofil : "Profil sauvegardé !",
    exportSuccess : "Données exportées !",
    importSuccess : "Données importées",
    saveSetting : "Paramètres modifiés !",
    templateCreation :"Modèle créé !",
    templateModification : "Modèle modifié !",
    templateDeleted : "Modèle supprimé !"
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
                icon: "./Icons/notifyRewardsColor192.png",
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






// * *  *   *   *   *   * ICS   *   *   **  *   *   *   *   







function onClickAddToCalendar(keyRef) {
    let activityTarget = onSearchActivity(keyRef);

    switch (userSetting.agenda) {
        case "NONE":
            alert("Veuillez sélectionner un  agenda dans 'Paramètres.'");
            break;
        case "ICS":
            onGenerateICS(activityTarget);
            break;
        case "GOOGLE":
            let urlGoogle = generateGoogleCalendarLink(activityTarget);
            window.open(urlGoogle, "_blank"); 
            break;
        case "OUTLOOK":
            let urlOutlook = generateOutlookCalendarLink(activityTarget);
            window.open(urlOutlook,"_blank");
            break;
    
        default:
            break;
    }

}








// GENERATION ICS
function onGenerateICS(activityTarget){
    // Formatage
    let commentFormated = activityTarget.comment.replace(/\r?\n/g, ' '); // Remplace tous les \n par espace
    let dateFormated = activityTarget.date.replaceAll("-",""),
    timeStartFormated = onConvertAgendaTime(userSetting.agendaScheduleStart),
    timeEndFormated = onConvertAgendaTime(userSetting.agendaScheduleEnd),
    notifyTime = onConvertNotifyTimeICS();

    const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//MonSuiviSportif//taralab//fr",
        "BEGIN:VEVENT",
        `UID:${generateUID()}@monsuivisportif.taralab.fr`,
        `DTSTAMP:${generateDTStamp()}`,
        `DTSTART:${dateFormated}${timeStartFormated}`,
        `DTEND:${dateFormated}${timeEndFormated}`,
        `SUMMARY:${activityChoiceArray[activityTarget.name].displayName}`,
        "DESCRIPTION:Activité générée depuis :\\n Mon Suivi Sportif.",
        `LOCATION:${activityTarget.location}`,
        "STATUS:CONFIRMED"
    ];
    
    // ✅ Ajout conditionnel de la notification
    if (userSetting.agendaNotify != "NONE") {
        icsLines.push(
            "BEGIN:VALARM",
            `TRIGGER:-PT${notifyTime.system}`,
            "ACTION:DISPLAY",
            `DESCRIPTION:Séance de ${activityChoiceArray[activityTarget.name].displayName} ${notifyTime.user}`,
            "END:VALARM"
        );
    }
    
    // ✅ Fin propre du fichier ICS
    icsLines.push("END:VEVENT", "END:VCALENDAR");
    
    // 🔹 Maintenant, on assemble chaque ligne avec "\r\n" pour éviter d'avoir tout sur une seule ligne
    const icsContent = icsLines.join("\r\n");
    
    // ✅ Vérification avant exportation
    console.log(icsContent);
    


    // Génération du fichier .ics
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    // Télécharger le fichier
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activityTarget.name}_${dateFormated}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

// GENERATION GOOGLE URL
function generateGoogleCalendarLink(activityTarget) {

    let title = activityChoiceArray[activityTarget.name].displayName,
        description = activityTarget.comment,
        location = activityTarget.location,
        dateFormated = activityTarget.date.replaceAll("-","");
        scheduleStartFormated = userSetting.agendaScheduleStart.replaceAll(":","");
        scheduleEndFormated = userSetting.agendaScheduleEnd.replaceAll(":","");



    description = description + "<br> <br>Mon Suivi Sportif.";//signature

    let dateStart = `${dateFormated}T${scheduleStartFormated}00`,
        dateEnd = `${dateFormated}T${scheduleEndFormated}00`;

    console.log(dateStart);


    return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
           `&text=${encodeURIComponent(title)}` +
           `&details=${encodeURIComponent(description)}` +
           `&location=${encodeURIComponent(location)}` +
           `&dates=${dateStart}/${dateEnd}` +
           `&trp=true`;
}



// GENERATION OUtLOOK URL
function generateOutlookCalendarLink(activityTarget) {

    let title = activityChoiceArray[activityTarget.name].displayName,
        description = convertLineBreaksForOutlook(activityTarget.comment),
        location = activityTarget.location;

    description = description + "<br> <br>Mon Suivi Sportif.";//signature

    let dateStart = `${activityTarget.date}T${userSetting.agendaScheduleStart}:00`,
        dateEnd = `${activityTarget.date}T${userSetting.agendaScheduleEnd}:00`;


    return `https://outlook.live.com/calendar/0/deeplink/compose?` +
           `subject=${encodeURIComponent(title)}` +
           `&body=${encodeURIComponent(description)}` +
           `&location=${encodeURIComponent(location)}` +
           `&startdt=${dateStart}` +
           `&enddt=${dateEnd}` +
           `&allday=false`;
}



function generateDTStamp() {
    const now = new Date();  // Date actuelle
    return now.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
}

function generateUID() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15); // Format YYYYMMDDTHHMMSS
    const randomPart = Math.random().toString(36).slice(2, 8); // Génère un ID aléatoire de 6 caractères
    return `${timestamp}-${randomPart}`;
}

function convertLineBreaksForOutlook(description) {
    return description.replace(/\n/g, "<br>"); // Remplace les retours à la ligne par %0D%0A
}

function onConvertAgendaTime(input) {
    let result = input.replaceAll(":","");
    return `T${result}00`;
}

// convertion des notifications pour les ICS
function onConvertNotifyTimeICS() {
    let timeNotify = {system:"",user:""};
    switch (userSetting.agendaNotify) {
        case "0":
            timeNotify.system = "0M";
            timeNotify.user = "maintenant !";
            break;
        case "10":
            timeNotify.system = "10M";
            timeNotify.user = "dans 10 min !";
            break;
        case "30":
            timeNotify.system = "30M";
            timeNotify.user = "dans 30 min !";
            break;
        case "1":
            timeNotify.system = "1H";
            timeNotify.user = "dans 1 heure !";
            break;
        case "2":
            timeNotify.system = "2H";
            timeNotify.user = "dans 2 heures !";
            break;
        default:
            break;
    }


    return timeNotify;
}




onInitMobileNotify();
