
let userCounterList = [
    {title:"POMPES",initDate:"15-25-2025",count:"47"},
    {title:"TRACTIONS",initDate:"17-25-2025",count:"0"},
    {title:"SQUAT",initDate:"15-25-2025",count:"246"}

],
    maxCounter = 10;





async function onOpenMenuCounter(){

    await onLoadCounterFromDB();
    onDisplayCounter(userCounterList);
}
   
   
   
   
   
   
// fonction pour récupérer les compteurs
async function onLoadCounterFromDB () {
    userCounterList = [];
    try {
        const result = await db.allDocs({ include_docs: true }); // Récupère tous les documents

        // Filtrer les éléments concernée
        userCounterList = result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === counterStoreName);
            if (devMode === true){
                console.log("[DATABASE] [ACTIVITY] Activités chargées :", counterStoreName);
                console.log(userCounterList[0]);
            };
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors du chargement:", err);
    }
}



   
   
// Insertion nouveau Compteur
async function onInsertNewCounterInDB(counterToInsert) {
    try {
        // Obtenir le prochain ID
        const nextId = await getNextIdNumber(counterCountIDStoreName);

        // Créer l'objet avec le nouvel ID
        const newCounter = {
            _id: `${counterStoreName}_${nextId}`,
            type: counterStoreName,
            ...counterToInsert
        };

        // Insérer dans la base
        await db.put(newCounter);

        if (devMode === true ) {console.log("[DATABASE] [COUNTER Template inséré :", newCounter);};

        return newCounter;
    } catch (err) {
        console.error("[DATABASE] [COUNTER] Erreur lors de l'insertion du template :", err);
    }
}
   
   
   
   


// Modification Compteur
async function onInsertCounterModificationInDB(counterToUpdate,key) {

    try {
        // Récupérer l'élément actuel depuis la base
        let existingDoc = await db.get(key);

        // Mettre à jour les champs nécessaires en conservant `_id` et `_rev`
        const updatedDoc = {
            ...existingDoc,  // Garde _id et _rev pour la mise à jour
            ...counterToUpdate // Remplace les valeurs avec les nouvelles
        };

        // Enregistrer les modifications dans la base
        await db.put(updatedDoc);

        if (devMode === true ) {console.log("[COUNTER] Activité mis à jour :", updatedDoc);};

        return updatedDoc; // Retourne l'objet mis à jour
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'activité :", err);
    }
}

// Suppression Compteur
async function deleteCounter(counterKey) {
    try {
        // Récupérer le document à supprimer
        let docToDelete = await db.get(counterKey);

        // Supprimer le document
        await db.remove(docToDelete);

        if (devMode === true ) {console.log("[COUNTER] Activité supprimée :", counterKey);};

        return true; // Indique que la suppression s'est bien passée
    } catch (err) {
        console.error("[COUNTER] Erreur lors de la suppression de l'activité :", err);
        return false; // Indique une erreur
    }
}






// ---------------------------------------- FIN FONCTION GLOBAL -------------------------






// Séquence d'insertion d'un nouveau compteur

async function eventInsertNewCompteur(dataToInsert) {
    await onInsertNewCounterInDB(dataToInsert);
    await onLoadCounterFromDB();


    // fonction de création affichage des compteurs

    
}









function onDisplayCounter(counterList) {
    if (devMode === true){console.log(" [COUNTER] génération de la liste");};

    let divCounterRef = document.getElementById("divCounter");
    // Reset
    divCounterRef.innerHTML = "";


    // Affichage en cas d'aucune modèle
    if (userCounterList.length < 1) {
        divCounterRef.innerHTML = "Aucun compteur à afficher !";
        return
    }

    // Génère les compteurs
    counterList.forEach(e=>{

        // le container du compteur
        let newCounterContainer = document.createElement("div");
            newCounterContainer.classList.add("compteur-container");

        // la date
        let newCounterDate = document.createElement("p");
            newCounterDate.classList.add("compteur-date");
            newCounterDate.id = `counterDate_${e._id}`;
            newCounterDate.innerHTML = e.initDate;

        // Le nom du compteur
        let newCounterName = document.createElement("p");
            newCounterName.classList.add("compteur-name");
            newCounterName.innerHTML = e.title;

        // la zone d'interaction
        let newInterractionContent = document.createElement("div");
            newInterractionContent.classList.add("compteur-content");

        // AFFICHAGE DU TOTAL
        let newSpanTotalCount = document.createElement("span");
            newSpanTotalCount.classList.add("compteur-total");
            newSpanTotalCount.id = `counterTotal_${e._id}`;
            newSpanTotalCount.innerHTML = e.count;

        // L'input de nombre à ajouter
        let newInputCounter = document.createElement("input");
            newInputCounter.type = "number";
            newInputCounter.placeholder = "Ajout";
            newInputCounter.classList.add("compteur");


        // LES BOUTONS

        // ajouter au compte
        let newBtnCounterAdd = document.createElement("button");
            newBtnCounterAdd.classList.add("btn-menu","btnFocus");
        
        let newBtnImgCounterAdd = document.createElement("img");
            newBtnImgCounterAdd.src = "./Icons/Icon-Accepter.webp";

        newBtnCounterAdd.appendChild(newBtnImgCounterAdd);


        // Reset
        let newBtnCounterReset = document.createElement("button");
            newBtnCounterReset.classList.add("btn-menu");
   
        let newBtnImgCounterDelete = document.createElement("img");
            newBtnImgCounterDelete.src = "./Icons/Icon-Reset.webp";

        newBtnCounterReset.appendChild(newBtnImgCounterDelete);
    
    
        // SUPPRIMER
        let newBtnCounterDelete = document.createElement("button");
            newBtnCounterDelete.classList.add("btn-menu");
   
        let newBtnImgCounterReset = document.createElement("img");
            newBtnImgCounterReset.src = "./Icons/Icon-Delete-color.webp";

        newBtnCounterDelete.appendChild(newBtnImgCounterReset);




        // Les insertions
        newInterractionContent.appendChild(newSpanTotalCount);
        newInterractionContent.appendChild(newInputCounter);
        newInterractionContent.appendChild(newBtnCounterAdd);
        newInterractionContent.appendChild(newBtnCounterReset);
        newInterractionContent.appendChild(newBtnCounterDelete);

        newCounterContainer.appendChild(newCounterDate);
        newCounterContainer.appendChild(newCounterName);
        newCounterContainer.appendChild(newInterractionContent);

        divCounterRef.appendChild(newCounterContainer);

    });
}












   // Retour depuis Info
   function onClickReturnFromCounter() {
   
   
       // ferme le menu
       onLeaveMenu("Counter");
   };