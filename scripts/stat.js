
// Ouverture du menu
function onOpenMenuStat(){
    console.log("Ouverture menu STAT");
    onGenerateDynamiqueStatFilter(allUserActivityArray);

    displayGeneralStats(allUserActivityArray);
}

// Referencement
let selectorStatRef = document.getElementById("selectorStat");






// remplit dynamiquement les options dans le selection de statistique
function onGenerateDynamiqueStatFilter(allData) {
    console.log("[STAT] récupère les types d'activité de l'utilisateur" )
    let dynamicFilterList = [];
    


    // Recupère les nouvelle catégorie présente dans la liste en cours
    allData.forEach(data=>{
        if (!dynamicFilterList.includes(data.name))  {
            dynamicFilterList.push(data.name);
        };
    });

    dynamicFilterList.sort();

    console.log("[STAT] valeur de dynamicFilterList = " );
    console.log(dynamicFilterList);


    // Crée les options dans le selection pour les catégorie
    onGenerateStatOptionFilter(dynamicFilterList);
};



// Génération des options d'activité pour le filtre avec tri
function onGenerateStatOptionFilter(allActivityTypeData) {

    selectorStatRef.innerHTML = "";


    // Ajouter l'option "Tous" au début
    let allOption = document.createElement("option");
    allOption.value = "GENERAL";
    allOption.innerHTML = "Général";
    selectorStatRef.appendChild(allOption);



    // Ajouter les autres options triées
    allActivityTypeData.forEach(activityType => {

        // extraite tous les éléments de l'objet du tableau
        let currentObject = getActivityChoiceArrayRefByDataName(activityType);

        let newOption = document.createElement("option");
        newOption.value = currentObject.dataName;
        newOption.innerHTML = currentObject.displayName;
        selectorStatRef.appendChild(newOption);
    });

};











// ------------------------------------   GENERATION DES STAT --------------------------------


// Fonction onChange pour changer entre général et activité spécifique
function onChangeSelector(value) {
    console.log("[SELECTOR] Changement de sélection :", value);

    if (value === "GENERAL") {
        // Appeler la fonction pour afficher les statistiques générales
        displayGeneralStats(allUserActivityArray);
    } else {
        // Appeler la fonction pour afficher les statistiques de l'activité sélectionnée
        displayStats(value);
    }
}

// Fonction pour convertir la durée au format hh:mm:ss en minutes
function durationToMinutes(duration) {
    if (!duration || typeof duration !== "string") {
        duration = "00:00:00"; // Valeur par défaut si la durée est invalide
    }
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0) + (seconds || 0) / 60; // Conversion totale en minutes
}

// Fonction pour formater la durée en heures:minutes:secondes
function formatDuration(totalMinutes) {
    if (isNaN(totalMinutes) || totalMinutes < 0) {
        return "00:00:00"; // Valeur par défaut si les minutes totales sont invalides
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);

    // Formater en HH:MM:SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Récupère les statistiques de l'activité
function getStats(activityList, activityName, days = null) {
    const today = new Date();

    // Filtrer les sessions pour l'activité donnée
    const filteredSessions = activityList.filter(activity => {
        const isSameActivity = activity.name === activityName;
        const isWithinDays = days
            ? (today - new Date(activity.date)) / (1000 * 60 * 60 * 24) <= days
            : true; // Inclure toutes les sessions si `days` est null
        return isSameActivity && isWithinDays;
    });

    // Si aucune session n'est trouvée, renvoyer des valeurs par défaut
    if (filteredSessions.length === 0) {
        return {
            totalSessions: 0,
            totalDuration: 0,
            totalDistance: 0,
            lastActivityDate: null,
            firstActivityDate: null
        };
    }

    // Trier les sessions par date (du plus récent au plus ancien)
    filteredSessions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculer les statistiques
    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, session) =>
        sum + durationToMinutes(session.duration || "00:00:00"), 0
    ); // En minutes
    const totalDistance = filteredSessions.reduce((sum, session) =>
        sum + parseFloat(session.distance || 0), 0
    );

    // Dernière activité pratiquée (la plus récente)
    const lastActivityDate = new Date(filteredSessions[0].date); // La première après le tri est la plus récente

    // Première activité pratiquée (la plus ancienne)
    const firstActivityDate = new Date(filteredSessions[filteredSessions.length - 1].date); // La dernière après le tri est la plus ancienne

    return {
        totalSessions,
        totalDuration, // En minutes
        totalDistance, // En km
        lastActivityDate,
        firstActivityDate,
    };
}

function displayStats(activityName) {
    console.log("[STAT] demande de stat pour " + activityName);

    // Récupérer les statistiques
    const statsAllTime = getStats(allUserActivityArray, activityName);
    const stats7Days = getStats(allUserActivityArray, activityName, 7);
    const stats30Days = getStats(allUserActivityArray, activityName, 30);

    // Formater les dates des premières et dernières activités pratiquées
    const firstActivityDateFormatted = statsAllTime.firstActivityDate
        ? statsAllTime.firstActivityDate.toLocaleDateString("fr-FR")
        : "Aucune activité";
    const lastActivityDateFormatted = statsAllTime.lastActivityDate
        ? statsAllTime.lastActivityDate.toLocaleDateString("fr-FR")
        : "Aucune activité";

    // Calcul des informations générales
    const totalKm = statsAllTime.totalDistance.toFixed(2);
    const totalDurationFormatted = formatDuration(statsAllTime.totalDuration);

    // Texte convivial pour l'utilisateur
    const generalText = `Depuis le <b>${firstActivityDateFormatted}</b>, tu as pratiqué <b>${statsAllTime.totalSessions} session(s)</b> de <b>${activityName.replace("_", " ").toUpperCase()}</b>, parcouru environ <b>${totalKm} km</b> et accumulé <b>${totalDurationFormatted} heure(s)</b>. Ta dernière activité de ce type remonte au <b>${lastActivityDateFormatted}</b>.`;

    // Vérification pour les 7 derniers jours
    const sevenDaysText = stats7Days.totalSessions === 0 
        ? "Il semble que tu n'aies pas pratiqué cette activité ces derniers jours." 
        : `
            <p>Nombre total de séances : <b>${stats7Days.totalSessions}</b></p>
            <p>Durée totale : <b>${formatDuration(stats7Days.totalDuration)}</b></p>
            <p>Distance totale : <b>${stats7Days.totalDistance.toFixed(2)} km</b></p>
        `;

    // Vérification pour les 30 derniers jours
    const thirtyDaysText = stats30Days.totalSessions === 0 
        ? "Cela fait un certain temps que tu n'as pas pratiqué cette activité." 
        : `
            <p>Nombre total de séances : <b>${stats30Days.totalSessions}</b></p>
            <p>Durée totale : <b>${formatDuration(stats30Days.totalDuration)}</b></p>
            <p>Distance totale : <b>${stats30Days.totalDistance.toFixed(2)} km</b></p>
        `;

    // Afficher les résultats
    document.getElementById("stats").innerHTML = `
        <p class="stat">Statistiques pour ${activityName.replace("_", " ")}</p>
        
        <section class="stat">
            <p>${generalText}</p>
        </section>
        
        <section class="stat">
            <label>Sur les 7 derniers jours</label>
            <p>${sevenDaysText}</p>
        </section>
        
        <section class="stat">
            <label>Sur les 30 derniers jours</label>
            <p>${thirtyDaysText}</p>
        </section>
    `;
}



// Fonction pour afficher les statistiques générales
function displayGeneralStats(activityList) {
    if (!activityList || activityList.length === 0) {
        document.getElementById("stats").innerHTML = `
            <p>Bienvenue ! Commence à enregistrer tes activités pour découvrir tes statistiques ici. 🚀</p>
        `;
        return;
    }

    // Calculs nécessaires
    const totalActivities = activityList.length;
    const totalDuration = activityList.reduce((sum, activity) => 
        sum + durationToMinutes(activity.duration || "00:00:00"), 0
    );
    const totalDistance = activityList.reduce((sum, activity) => 
        sum + parseFloat(activity.distance || 0), 0
    );
    const firstActivityDate = new Date(Math.min(...activityList.map(a => new Date(a.date))));
    const firstActivityName = activityList[0].name; // Activité la plus ancienne
    const formattedDate = firstActivityDate.toLocaleDateString("fr-FR");

    // Texte convivial pour l'utilisateur
    document.getElementById("stats").innerHTML = `
        <p class="stat">Statistiques générales</p>
        <section class="stat">
            <p>
                Depuis le <b>${formattedDate}</b>, tu as pratiqué <b>${totalActivities} activité(s)</b>, 
                parcouru environ <b>${totalDistance.toFixed(2)} km</b> et accumulé <b>${formatDuration(totalDuration)}</b> heure(s) de sport. 
                Bravo ! Ton activité préférée est : <b>${firstActivityName.replace("_", " ")}</b>. Continue comme ça, tu es sur la bonne voie !👍
            </p>
        </section>
    `;
}








// Retour depuis Stat
function onClickReturnFromStat() {


    // ferme le menu
    onLeaveMenu("Stat");
};