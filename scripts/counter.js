
let userCounterList = {
    "Counter_1": { "type": "Counter", "name": "Compteur 1", "count": 5 },
    "Counter_2": { "type": "Counter", "name": "Compteur 2", "count": 10 }
},
    maxCounter = 10;

let counterColor = {
    white: "#fff",
    green: "#d3ffd0",
    yellow: "#fdffd0",
    red: "#ffd7d0",
    blue: "#d0ebff",
    violet: "#f7d0ff"
};

let counterColorSelected = "#fff";//utiliser lors de la création d'un compteur



async function onOpenMenuCounter(){

    await onLoadCounterFromDB();
    onDisplayCounter(userCounterList);
    // Gestion si max atteind
    gestionMaxCounterReach();
}
   
   
   
   
   
async function onLoadCounterFromDB() {
    userCounterList = {}; // Initialisation en objet

    try {
        const result = await db.allDocs({ include_docs: true });

        // Filtrer et transformer en objet avec _id comme clé sans _rev
        userCounterList = result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === counterStoreName)
            .reduce((acc, { _id, _rev, ...rest }) => {
                acc[_id] = rest; // Utilise _id comme clé et stocke le reste sans _id et _rev
                return acc;
            }, {});

        if (devMode === true) {
            console.log("[DATABASE] [ACTIVITY] Activités chargées :", counterStoreName);
            console.log(userCounterList);
        }
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors du chargement:", err);
    }
}





   
   
// Insertion nouveau Compteur
async function onInsertNewCounterInDB(counterToInsert) {

    console.log("counterToInsert",counterToInsert);

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

    // remet les éléments dans la couleur par défaut
    counterColorSelected = counterColor["white"];
    document.getElementById("divCreateCounterContent").style.backgroundColor = counterColorSelected;

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



// Gestion des couleurs

function onChooseCounterColor(color) {
    document.getElementById("divCreateCounterContent").style.backgroundColor = counterColor[color];
    counterColorSelected = counterColor[color];
}



function onConfirmCreateCounter() {
    
    // masque le popup de création
    document.getElementById("divCreateCounter").style.display = "none";

    // Récupère le nom du compteur ou set un nom par défaut
    let newCounterName = document.getElementById("newCounterName").value || "Nouveau Compteur",
        newCounterDate = onFindDateTodayUS();

    // formatage du nom. Recherche de doublon
    let isCounterDoublonName = Object.values(userCounterList).some(counter => counter.name === newCounterName);

    if (isCounterDoublonName) {
        if (devMode === true){console.log(" [COUNTER] Doublon de nom détecté");};
        newCounterName += "_1";
    }

    let newCounterToCreate = {name: newCounterName, initDate: newCounterDate, count: 0, color : counterColorSelected};

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

    // Popup notification
    onShowNotifyPopup(notifyTextArray.counterCreated);

}


// Gestion si le nombre maximal de compteur atteints
function gestionMaxCounterReach() {
        // Gestion bouton new compteur
        document.getElementById("btnAddNewCounter").disabled = Object.keys(userCounterList).length >= maxCounter ? true : false;
}





function onDisplayCounter() {
    if (devMode === true){console.log(" [COUNTER] génération de la liste");};

    let divCounterRef = document.getElementById("divCounter");
    // Reset
    divCounterRef.innerHTML = "";


    // Affichage en cas d'aucune modèle
    if (Object.keys(userCounterList).length < 1) {
        divCounterRef.innerHTML = "Aucun compteur à afficher !";
        return
    }

    let counterKeysList = Object.keys(userCounterList);

    // Génère les compteurs
    counterKeysList.forEach((key,index)=>{

        // le container du compteur
        let newCounterContainer = document.createElement("div");
            newCounterContainer.classList.add("compteur-container");
            newCounterContainer.style.backgroundColor = userCounterList[key].color;
            newCounterContainer.id = `counterContainer_${key}`;

        // la date
        let newCounterDate = document.createElement("p");
            newCounterDate.classList.add("compteur-date");
            newCounterDate.id = `counterDate_${key}`;
            if (userCounterList[key].initDate === dateToday) {
                newCounterDate.innerHTML = "Auj.";
            }else if (userCounterList[key].initDate === dateYesterday) {
                newCounterDate.innerHTML = "Hier";
            }else{
                const dateCounterFormated = onFormatDateToFr(userCounterList[key].initDate);
                newCounterDate.innerHTML = `${dateCounterFormated}`;
            };

        // Le nom du compteur
        let newCounterName = document.createElement("p");
            newCounterName.classList.add("compteur-name");
            newCounterName.innerHTML = userCounterList[key].name;

        // la zone d'interaction
        let newInterractionContent = document.createElement("div");
            newInterractionContent.classList.add("compteur-content");

        // AFFICHAGE DU TOTAL
        let newSpanTotalCount = document.createElement("span");
            newSpanTotalCount.classList.add("compteur-total");
            newSpanTotalCount.id = `counterTotal_${key}`;
            newSpanTotalCount.innerHTML = userCounterList[key].count;

        // L'input de nombre à ajouter
        let newInputCounter = document.createElement("input");
            newInputCounter.type = "number";
            newInputCounter.placeholder = "Ajout";
            newInputCounter.classList.add("compteur");
            newInputCounter.id= `inputCounter_${key}`;


        // LES BOUTONS

        // ajouter au compte
        let newBtnCounterAdd = document.createElement("button");
            newBtnCounterAdd.classList.add("btn-menu","btnFocus");
            newBtnCounterAdd.onclick = function (){
                onClickIncrementeCounter(key);
            }
        
        let newBtnImgCounterAdd = document.createElement("img");
            newBtnImgCounterAdd.src = "./Icons/Icon-Accepter.webp";

        newBtnCounterAdd.appendChild(newBtnImgCounterAdd);


        // Reset
        let newBtnCounterReset = document.createElement("button");
            newBtnCounterReset.classList.add("btn-counter");
            newBtnCounterReset.onclick = function (){
                onClickResetCounter(key);
            }
   
        let newBtnImgCounterDelete = document.createElement("img");
            newBtnImgCounterDelete.src = "./Icons/Icon-Reset.webp";

        newBtnCounterReset.appendChild(newBtnImgCounterDelete);
    
    
        // SUPPRIMER
        let newBtnCounterDelete = document.createElement("button");
            newBtnCounterDelete.classList.add("btn-counter");
            newBtnCounterDelete.onclick = function (){
                onClickDeleteCounter(key);
            }
   
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
        if (index === (Object.keys(userCounterList).length - 1)) {
            let newClotureList = document.createElement("span");
            newClotureList.classList.add("last-container");
            newClotureList.innerHTML = `ℹ️ Vous pouvez créer jusqu'à ${maxCounter} compteurs.`;
            divCounterRef.appendChild(newClotureList);
        }

    });
}






// ------------------------- INCREMENTATION ---------------------------------


// lorsque j'incremente, récupère la valeur dans total, ajoute la nouvelle valeur
// et le nouveau résultat est mis dans total ainsi que sauvegardé en base
function onClickIncrementeCounter(idRef) {


    // controle si valeur existe dans input
    let inputRef = document.getElementById(`inputCounter_${idRef}`),
        textTotalRef = document.getElementById(`counterTotal_${idRef}`);


    if (inputRef.value === "") {
        if (devMode === true){console.log(" [COUNTER] Aucune valeur à ajouter");};
        return
    }

    // récupère ancien total et nouvelle valeur
    let oldValue = userCounterList[idRef].count,
        newValue = parseInt(inputRef.value);


    // Addition
    let newTotal = oldValue + newValue;


    // vite input, Set nouveau résultat dans html, variable et update base
    inputRef.value = "";
    textTotalRef.innerHTML = newTotal;//le html
    userCounterList[idRef].count = newTotal;//le tableau
    //La base


    onInsertCounterModificationInDB(userCounterList[idRef],idRef);

    if (devMode === true){console.log(userCounterList);};


    // ANIMATION

    // Ajouter la classe pour l'animation
    textTotalRef.classList.add("count-animated");

    // Supprimer la classe après l'animation pour la rejouer à chaque changement
    setTimeout(() => {
        textTotalRef.classList.remove("count-animated");
    }, 300);
    
}



// ------------------------- RESET ---------------------------------

// Lorsque je reset, recupère la date du jour
// set la total à zero,
// Actualise tous les éléments visual, dans la variable et en base


function onClickResetCounter(idRef) {

    // Récupère les références
    let inputRef = document.getElementById(`inputCounter_${idRef}`),
        textTotalRef = document.getElementById(`counterTotal_${idRef}`),
        textDateRef = document.getElementById(`counterDate_${idRef}`);


    // Récupère la date du jours
    let newInitDate = onFindDateTodayUS();

    // Set les variables
    userCounterList[idRef].initDate = newInitDate; 
    userCounterList[idRef].count = 0;


    // Set le html
    inputRef.value = "";
    textTotalRef.innerHTML = 0;
    // Date
    if (newInitDate === dateToday) {
        textDateRef.innerHTML = "Auj.";
    }else if (newInitDate === dateYesterday) {
        textDateRef.innerHTML = "Hier";
    }else{
        const dateCounterFormated = onFormatDateToFr(newInitDate);
        textDateRef.innerHTML = `${dateCounterFormated}`;
    };



    // Actualise la base

    onInsertCounterModificationInDB(userCounterList[idRef],idRef);

    if (devMode === true){console.log(userCounterList);};



    // Ajouter la classe pour l'animation
    textTotalRef.classList.add("anim-reset");

    // Supprimer la classe après l'animation pour la rejouer à chaque changement
    setTimeout(() => {
        textTotalRef.classList.remove("anim-reset");
    }, 300);

}



// ------------------------------------ SUPPRESSION -----------------------

let idCounterToDelete = "";
function onClickDeleteCounter(idTarget) {

    idCounterToDelete = idTarget;

    // Affiche le popup
    document.getElementById("divConfirmDeleteCounter").classList.add("show");
}


//Annule la suppression
function onAnnulDeleteCounter(event) {
    document.getElementById("divConfirmDeleteCounter").classList.remove("show");
}

// Confirme la suppression
function onConfirmDeleteCounter(event) {
    event.stopPropagation();
    document.getElementById("divConfirmDeleteCounter").classList.remove("show");
    eventDeleteCounter();
}



async function eventDeleteCounter(){
    //suppression dans la variable
    delete userCounterList[idCounterToDelete];

    // supression htlm
    document.getElementById(`counterContainer_${idCounterToDelete}`).remove();

    // Suppression base
    deleteCounter(idCounterToDelete);

    // Gestion si max atteind ou non
    gestionMaxCounterReach();


    // Affichage en cas d'aucun compteur
    

    if (Object.keys(userCounterList).length < 1) {
        let divCounterRef = document.getElementById("divCounter");
        divCounterRef.innerHTML = "Aucun compteur à afficher !";
    }

    // Popup notification
    onShowNotifyPopup(notifyTextArray.counterDeleted);
}







// Retour depuis Info
function onClickReturnFromCounter() {

   
       // ferme le menu
       onLeaveMenu("Counter");
   };