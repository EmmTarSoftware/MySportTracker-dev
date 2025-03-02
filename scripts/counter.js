
let userCounterList = [{name:"",initDate:"",count: 0}],
    maxCounter = 10;





async function onOpenMenuCounter(){

    await onLoadCounterFromDB();
    onDisplayCounter(userCounterList);
    // Gestion si max atteind
    gestionMaxCounterReach();
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


//----------------------------- NOUVEAU COMPTEUR------------------------------------


function onClickAddCounter() {
    // Reset l'emplacement du nom
    document.getElementById("newCounterName").value = "";
    // Affiche 
    document.getElementById("divCreateCounter").style.display = "flex";
}



function onAnnulAddCounter(){
    document.getElementById("divCreateCounter").style.display = "none";
}


// Empeche de fermer la div lorsque l'utilisateur clique dans cette zone
function onClickDivNewPopupContent(event) {
    event.stopPropagation();
}



function onConfirmCreateCounter() {
    
    // masque le popup de création
    document.getElementById("divCreateCounter").style.display = "none";

    // Récupère le nom du compteur ou set un nom par défaut
    let newCounterName = document.getElementById("newCounterName").value || "Nouveau Compteur",
        newCounterDate = onFindDateTodayUS();

    // formatage du nom. Recherche de doublon
    let counterDoublon = userCounterList.filter(counter => counter.name ===newCounterName);
    if (counterDoublon.length > 0) {
        if (devMode === true){console.log(" [COUNTER] Doublon de nom détecté");};
        newCounterName += "_1";
    }

    let newCounterToCreate = {name: newCounterName, initDate: newCounterDate, count: 0};

    eventInsertNewCompteur(newCounterToCreate);
}




// Séquence d'insertion d'un nouveau compteur

async function eventInsertNewCompteur(dataToInsert) {

    // Formatage du nouveau compteur (nom, date et count =0)

    await onInsertNewCounterInDB(dataToInsert);
    await onLoadCounterFromDB();


    // fonction de création affichage des compteurs
    onDisplayCounter(userCounterList);
    
    // Gestion si max atteind
    gestionMaxCounterReach();


}


// Gestion si le nombre maximal de compteur atteints
function gestionMaxCounterReach() {
        // Gestion bouton new compteur
        document.getElementById("btnAddNewCounter").disabled = userCounterList.length >= maxCounter ? true : false;
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
    counterList.forEach((e,index)=>{

        // le container du compteur
        let newCounterContainer = document.createElement("div");
            newCounterContainer.classList.add("compteur-container");

        // la date
        let newCounterDate = document.createElement("p");
            newCounterDate.classList.add("compteur-date");
            newCounterDate.id = `counterDate_${e._id}`;
            if (e.initDate === dateToday) {
                newCounterDate.innerHTML = "Auj.";
            }else if (e.initDate === dateYesterday) {
                newCounterDate.innerHTML = "Hier";
            }else{
                const dateCounterFormated = onFormatDateToFr(e.initDate);
                newCounterDate.innerHTML = `${dateCounterFormated}`;
            };

        // Le nom du compteur
        let newCounterName = document.createElement("p");
            newCounterName.classList.add("compteur-name");
            newCounterName.innerHTML = e.name;

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


        // Creation de la ligne de fin pour le dernier index
        if (index === (userCounterList.length - 1)) {
            let newClotureList = document.createElement("span");
            newClotureList.classList.add("last-container");
            newClotureList.innerHTML = "ℹ️ Vous pouvez créer jusqu'à 10 compteurs.";
            divCounterRef.appendChild(newClotureList);
        }

    });
}












   // Retour depuis Info
   function onClickReturnFromCounter() {
   
   
       // ferme le menu
       onLeaveMenu("Counter");
   };