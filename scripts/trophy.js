// Variables

// Tableau des rewards
const allRewardsArray = [
    {rewardsName:"ACTIVITES-20", imgRef : "./Badges/Badge-20-activite.webp", title: "TITRE 20", text : "A accomplit 20 activités."},
    {rewardsName:"ABSENT", imgRef : "./Badges/Badge-absent.webp", title: "Aux abonnées absent !", text : "Aucune activité depuis plus d'un mois !"},
    {rewardsName:"MUSCU-10", imgRef : "./Badges/Badge-Muscu-10-seance.webp", title: "MUSCU-10", text : "A pratiqué 10 séances de musculation."},
    {rewardsName:"CAP-10", imgRef : "./Badges/Badge-running-10km.webp",title: "CAP 10",  text : "A parcouru 10km en une séance de course à pied."},
    {rewardsName:"CAP-SEMI", imgRef : "./Badges/Badge-running-semi.webp",title: "SEMI",  text : "A réalisé un semi-marathon."},
    {rewardsName:"CAP-MARATHON", imgRef : "./Badges/Badge-marathon.webp",title: "MARATHONIEN",  text : "Ça c'est fait !"},
    {rewardsName:"1-AN", imgRef : "./Badges/Badge-1-an.webp", title: "1 AN DE SPORT", text : "Anniversaire de sportif !"},
    {rewardsName:"TRIATHLON", imgRef : "./Badges/Badge-triathlon.webp", title: "TRIATHLON", text : "Jamais deux sans trois !"}
];




// Les trophes possédés par l'utilisateur
let userRewardsArray = [],
    rewardsEligibleArray; //stockes les trophés auxquels l'utilisateur est éligible




// Reference 
let imgRewardsFullScreenRef,
pRewardsFullScreenTitleRef,
pRewardsFullScreenTextRef,
divRewardsListRef;








// ---------------------------------------- BDD -------------------------------------------







// Creation du profils par défaut
function onCreateDefaultRewardsInBase() {
    let transaction = db.transaction(rewardsStoreName,"readwrite");
    let store = transaction.objectStore(rewardsStoreName);

    let insertRequest = store.add(userRewardsArray);

    insertRequest.onsuccess = function () {
        if (devMode === true){console.log(" [ DATABASE REWARDS] un Premier ITEM a été créé dans la base");};
        // evenement de notification

        
    };

    insertRequest.onerror = function(event){
        console.log("[ DATABASE REWARDS] Error d'insertion du REWARDS");
        let errorMsg = event.target.error.toString();
        console.log(errorMsg);
        
    };

    transaction.oncomplete = function(){
        if (devMode === true){console.log("[ DATABASE REWARDS] nouveau profil : transaction insertData complete");};

    };
};    






// Fonction de modification du profil dans la base
function onInsertRewardsModificationInDB(e) {
    if (devMode === true){console.log("fonction d'insertion de la donnée modifié");};

    let transaction = db.transaction(rewardsStoreName,"readwrite");
    let store = transaction.objectStore(rewardsStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(1));

    

    modifyRequest.onsuccess = function () {
        if (devMode === true){console.log("modifyRequest = success");};

        let modifiedData = modifyRequest.result[0];

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            if (devMode === true){console.log("[ DATABASE REWARDS] insert ModifiedData = success");};

        };

        insertModifiedData.onerror = function (){
            console.log("[ DATABASE REWARDS] insert ModifiedData = error",insertModifiedData.error); 
        };
    };

    modifyRequest.onerror = function(){
        console.log("[ DATABASE REWARDS] ModifyRequest = error");
    };

    transaction.oncomplete = function(){

            // Traitement lorsque FINI
    };
};




function onExtractRewardsFromDB(){
    if (devMode === true){console.log("[ DATABASE REWARDS] Récupère les éléments dans la base");};

    let transaction = db.transaction([rewardsStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(rewardsStoreName);

    // Rechercher un élément où l'index 'userName' est égal à '1'
    let requestTask = objectStoreTask.get(1);


    // Traitement de la requête
    requestTask.onsuccess = function(event) {
        if (requestTask.result) {
            if (devMode === true){console.log('[ DATABASE REWARDS] Élément trouvé : ', requestTask.result);};

            onSetUserRewardsFromOpeningAPP(requestTask.result);

        } else {
            if (devMode === true){console.log('[ DATABASE REWARDS] Aucun élément trouvé pour le userName');};
        }
    };

    requestTask.onerror = function(event) {
        console.error( '[ DATABASE REWARDS] Erreur lors de la récupération de l\'élément', event.target.error);
    };

};

// Remplit les récompense de l'utilisateur lors de l'ouverture de l'application
function onSetUserRewardsFromOpeningAPP(rewards) {
    userRewardsArray = rewards;

    if (devMode === true){
        console.log("[REWARDS] les données ont été chargé pour l'utilisateur");
        console.log(userRewardsArray);
    };


}








// ----------------------------------   Fonction génériques-------------------------------












// Nombre d'activité pour une activité désigné
function onSearchActivityCountValue(data,activityTarget,countTarget){
    let allActivityTargetFound = data.filter(e=>{
        // Recupère toutes les d'activités concernés
        return e.name === activityTarget;
    });
    // Retour true ou false si le nombre désiré est atteind
    return allActivityTargetFound.length === countTarget;
};



// DISTANCE TOTAL d'une activité spécifique. Est-ce que c'est dans la fourchette ? 
function onSearchActivitiesTotalDistanceRange(activitiesData, bottomValue, topValue){

    if (devMode === true){console.log(`[REWARDS] recherche Distances cumulées Range entre : ${bottomValue} et ${topValue}`);};

    const totalDistance = activitiesData.reduce((sum, activity) => {
        // Si la distance est un nombre valide
        if (activity.distance) {
            return sum + parseFloat(activity.distance); // Additionner la distance en nombre flottant
        }
        return sum; // Si ce n'est pas la bonne activité ou si la distance est vide, garder la somme actuelle
    }, 0); // La somme commence à 0
    
    if (devMode === true){console.log("Valeur totale distance = " + totalDistance);};
    
    return totalDistance >= bottomValue && totalDistance <= topValue;

};



// DISTANCE TOTAL d'une activité spécifique. Est-ce que c'est supérieure ? 
function onSearchActivitiesTotalDistanceSuperior(data,targetValue){

    if (devMode === true){console.log(`[REWARDS] recherche Distances cumulées supérieures à : ${targetValue}`);};

    const totalDistance = data.reduce((sum, activity) => {
        // si la distance est un nombre valide
        if (activity.distance) {
            return sum + parseFloat(activity.distance); // Additionner la distance en nombre flottant
        }
        return sum; // Si ce n'est pas la bonne activité ou si la distance est vide, garder la somme actuelle
    }, 0); // La somme commence à 0
    
    if (devMode === true){console.log("Valeur totale distance = " + totalDistance);};
    
    return totalDistance >= targetValue;
};



// DISTANCE UNIQUE d'une activité spécifique. Est-ce que c'est dans la fourchette ? 
function onSearchActivityWithDistanceRange(data, bottomTarget, topTarget) {
    if (devMode === true){console.log(`[REWARDS] recherche d'une distance unique comprise entre : ${bottomTarget} et ${topTarget}`);};
    let targetFound = false;
    

    data.forEach(e=>{
        if (devMode === true){console.log(Number(e.distance));};
        if (Number(e.distance) >= bottomTarget  && Number(e.distance) <= topTarget) {
            targetFound = true;
            return targetFound;  
        }
    });

    return targetFound;
}

// DISTANCE UNIQUE d'une activité spécifique. Est-ce que c'est supérieur ? 
function onSearchActivityWithDistanceSuperior(data,targetValue) {

    if (devMode === true){console.log(`[REWARDS] recherche d'une distance unique supérieures à : ${targetValue}`);};
    let targetFound = false;

    data.forEach(e=>{
        if (devMode === true){console.log(Number(e.distance));};
        if (Number(e.distance) >= targetValue) {
            targetFound = true;
            return;
        }
    });

    return targetFound;
}




// Fonction de recherche du nombre d'activité différentes
function onSearchVariousActivitiesNumber(allData,targetValue,currentActivity) {
    if (devMode === true){console.log(`[REWARDS] Recheche d'activite de type different. Nombre cible : ${targetValue} et activite en cours : ${currentActivity}`);};


    let allTypeActivityList = [];


    // Recupère les catégories d'activités différentes
    allData.forEach(data=>{
        if (!allTypeActivityList.includes(data.name))  {
            allTypeActivityList.push(data.name);
        };
    });

    // Insertion de l'activité en cours dans la liste
    if (!allTypeActivityList.includes(currentActivity)) {
        allTypeActivityList.push(currentActivity);
    }

    if (devMode === true){
        console.log("[REWARDS] [GENERAL] de allTypeActivityList = " );
        console.log("Nombre d'activité différente : " + allTypeActivityList.length);
        console.log(allTypeActivityList);
    };

    return allTypeActivityList.length >= targetValue;
};











// ----------------------------------------- Ouverture menu récompense ------------------------------







function onOpenMenuRewards(){
    console.log("[REWARDS] Ouverture menu Rewards");

    // Reference les éléments
    imgRewardsFullScreenRef = document.getElementById("imgRewardsFullScreen");
    pRewardsFullScreenTextRef = document.getElementById("pRewardsFullScreenText");
    pRewardsFullScreenTitleRef = document.getElementById("pRewardsFullScreenTitle");
    divRewardsListRef = document.getElementById("divRewardsList");


    // Prend les récompenses de l'utilisateur pour les afficher dans la liste
    onLoadUserRewardsList();
    


};



// Creation des récompenses de l'user dans la liste
function onLoadUserRewardsList() {

    divRewardsListRef.innerHTML = "";


    if (userRewardsArray.length === 0) {
        divRewardsListRef.innerHTML = "Poursuit tes efforts pour obtenir des récompenses ! 🥇 ";
        return
    }



    console.log("[REWARDS] Création de la liste des récompenses de l'utilisateur");
    console.log(userRewardsArray);

    userRewardsArray.forEach(reward=>{

        // Recupère les éléments dans le tableau de référence
        let rewardsElement = onSearchRewardsInArray(reward);


        // Création des images
        let newImg = document.createElement("img");
        newImg.classList = "trophyList";
        newImg.src = rewardsElement.imgRef;
        newImg.onclick = function (){
            onDisplayRewardsFullScreen(rewardsElement.rewardsName);
        };

        // Insertion
        divRewardsListRef.appendChild(newImg);


    });
};





// ---------------------------------------- VISUALISATION   GROS PLAN    --------------------------------






// Fonction de recupération d'un trophy dans le tableau
function onSearchRewardsInArray(rewardsTarget) {
    return allRewardsArray.find(reward => reward.rewardsName === rewardsTarget);
};


// Affiche en grand la récompense
function onDisplayRewardsFullScreen(rewardsRef) {
    console.log("[REWARDS]  demande de visualisation de récompense : " + rewardsRef);

    let currentRewardsData = onSearchRewardsInArray(rewardsRef);


    console.log(currentRewardsData);

    // set les éléments et affiche
    imgRewardsFullScreenRef.src = currentRewardsData.imgRef;
    pRewardsFullScreenTextRef.innerHTML = currentRewardsData.text;
    pRewardsFullScreenTitleRef.innerHTML = currentRewardsData.title;

    document.getElementById("divFullScreenRewards").classList.add("show");
};


// Masque la récompense qui était en grand plan
function onHiddenFullscreenRewards() {
    console.log("cache la div de visualisation de récompense");
    document.getElementById("divFullScreenRewards").classList.remove("show");
};










// ---------------------------------    OBTENTION-------------------------------------




function onTestreward() {

    onSearchGeneralRewards(selectorRef.value);

}





// Recherche d'éligibilité aux trophés communs
function onSearchGeneralRewards(activityTarget) {


    // Reset le tableau de trophé auquels l'user est égilible
    if (devMode === true){console.log("[REWARDS] RESET rewardsEligibleArray");};
    rewardsEligibleArray = [];


    // Traitement des récompenses génériques
    if (devMode === true){console.log("[REWARDS] Traitement des récompenses génériques");};


    // POLYVALENT (5 activités différentes)
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] Test eligibilité pour : POLVALENT");};
    let POLVALENT = onSearchVariousActivitiesNumber(allUserActivityArray,5,activityTarget);
    if (POLVALENT === true) {
        rewardsEligibleArray.push("POLVALENT");
    }
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] POLVALENT Resultat : " + POLVALENT);};


    // 1re activité tout confondu
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] Test eligibilité pour : ACTIVITE-FIRST");};
        let ACTIVITE_FIRST = allUserActivityArray.length >= 1;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
    if (ACTIVITE_FIRST === true) {
        rewardsEligibleArray.push("ACTIVITE-FIRST");
    }
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] ACTIVITE-FIRST Resultat : " + ACTIVITE_FIRST);};


    // 100 ieme activité tout confondu
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] Test eligibilité pour : ACTIVITE-100");};
        let ACTIVITE_100 = allUserActivityArray.length >= 100;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
    if (ACTIVITE_100 === true) {
        rewardsEligibleArray.push("ACTIVITE-100");
    }
    if (devMode === true){console.log("[REWARDS] [GENERIQUE] ACTIVITE-100 Resultat : " + ACTIVITE_100);};







    // Traitement pour l'activité spécifique
    // Récupère uniquement les données concernant l'activité en question
    let activitiesTargetData = allUserActivityArray.filter(e=>{
        // Recupère toutes les d'activités concernés
        return e.name === activityTarget;
    });
    onSearchSpecifyRewards(activityTarget,activitiesTargetData);

}





// Traitement des récompenses spécitique à l'activité créée ou modifiée
function onSearchSpecifyRewards(activityTarget,filteredData) {


    switch (activityTarget) {
        case "C.A.P":
            onTraiteRewardsForCAP(filteredData);
            break;
        case "VELO":
            break;
        default:
            if (devMode === true){console.log("[REWARDS] Erreur activité non trouvé");};    
        break;
    }

    if (devMode === true){console.log("[REWARDS] FIN de traitement des trophés par type d'activité. Résultat : ");};
    if (devMode === true){console.log(rewardsEligibleArray);};


    // Traite les trophés définitifs à affecter à l'utilisateur
    onAffectFinalRewardsToUser();
}



// Traite les trophés définitifs à affecter à l'utilisateur
function onAffectFinalRewardsToUser() {
    
    if (devMode === true){
        console.log("[REWARDS] Trouve les trophés réelle à affecteur à l'USER ");
        console.log("[REWARDS] User éligible à : ");
        console.log(rewardsEligibleArray);
        console.log("[REWARDS] déjà possédé par l'user : ");
        console.log(userRewardsArray);
    };

    
    // Retrait des récompenses déjà possédées
    rewardsEligibleArray = rewardsEligibleArray.filter(e => !userRewardsArray.includes(e));

    if (devMode === true){
        console.log("[REWARDS] Récompenses définitives à donner à l'user : ");
        console.log(rewardsEligibleArray);
    };

    if (devMode === true){console.log("[REWARDS] ajout des récompenses à l'utilisateur ");};
    // Ajout des trophes dans le tableau de l'utilisateur
    rewardsEligibleArray.forEach(e=>{
        userRewardsArray.push(e);
    });

    if (devMode === true){
        console.log("[REWARDS] toutes les récompenses utilisateur : ");
        console.log(userRewardsArray.sort());
    };


    // Lance la fonction d'animation avec les donnée de "rewardsEligibleArray"

    // INSERTION BDD de la nouvelle variable "userRewardsArray"
    // onInsertRewardsModificationInDB(userRewardsArray);
}




// Traitement des trophy pour C.A.P
function onTraiteRewardsForCAP(filteredData) {
     // 1 séance
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-A-1-SEANCE");};
     let CAP_A_1_SEANCE = filteredData.length >= 1;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
     if (CAP_A_1_SEANCE === true) {
         rewardsEligibleArray.push("CAP-A-1-SEANCE");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_A_1_SEANCE);};


     // 10 séances
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-A-10-SEANCE");};
     let CAP_A_10_SEANCES = filteredData.length >= 10;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
     if (CAP_A_10_SEANCES === true) {
         rewardsEligibleArray.push("CAP-B-10-SEANCES");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_A_10_SEANCES);};



     // 50 séances
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-A-50-SEANCE");};
     let CAP_A_50_SEANCES = filteredData.length >= 50;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
     if (CAP_A_50_SEANCES === true) {
         rewardsEligibleArray.push("CAP-C-50-SEANCES");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_A_50_SEANCES);};


     // 100 séances
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-A-100-SEANCE");};
     let CAP_A_100_SEANCES = filteredData.length >= 100;//car il faut traiter si les gens l'ont utilisé avant la mise à jours
     if (CAP_A_100_SEANCES === true) {
         rewardsEligibleArray.push("CAP-B-100-SEANCES");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_A_100_SEANCES);};


     // Distance = entre 10 km et 10.950 km
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-E-10-KM");};
     let CAP_E_10_KM = onSearchActivityWithDistanceRange(filteredData,10,10.999);
     if (CAP_E_10_KM === true) {
         rewardsEligibleArray.push("CAP-E-10-KM");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_E_10_KM);};

     // Distance = entre 21 km et 21.950 km
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-F-SEMI-MARATHON");};
     let CAP_F_SEMI_MARATHON = onSearchActivityWithDistanceRange(filteredData,21,21.999);
     if (CAP_F_SEMI_MARATHON === true) {
         rewardsEligibleArray.push("CAP-F-SEMI-MARATHON");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_F_SEMI_MARATHON);};

     // Distance =  entre 42km et 42.999 km
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-G-MARATHON");};
     let CAP_G_Marathon = onSearchActivityWithDistanceRange(filteredData,42,42.999);
     if (CAP_G_Marathon === true) {
         rewardsEligibleArray.push("CAP-G-MARATHON");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_G_Marathon);};

     // Distance > 100km en une séance
     if (devMode === true){console.log("[REWARDS] [C.A.P] Test eligibilité pour : CAP-ULTRA-TRAIL");};
     let CAP_ULTRA_TRAIL = onSearchActivityWithDistanceSuperior(filteredData,100);
     if (CAP_ULTRA_TRAIL === true) {
         rewardsEligibleArray.push("CAP-ULTRA-TRAIL");
     }
     if (devMode === true){console.log("[REWARDS] [C.A.P] Resultat : " + CAP_ULTRA_TRAIL);};

}


   
//    -----------------------------     QUITTE MENU       ----------------------------------------------





   
//    Reset le menu des récompenses

function onResetRewardsMenu() {
    imgRewardsFullScreenRef= "";
    pRewardsFullScreenTextRef = "";
    pRewardsFullScreenTitleRef = "";
    divRewardsListRef = "";

    divRewardsListRef.innerHTML = "";
}
   
   
   
   
   // Retour depuis Trophy
function onClickReturnFromRewards() {

    onResetRewardsMenu();
   
    // ferme le menu
    onLeaveMenu("Rewards");
}