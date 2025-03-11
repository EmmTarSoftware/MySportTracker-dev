
let userCounterList = {
        "Counter_1": { 
            type: "Counter", name: "Compteur 1", 
            initDate:"", 
            currentCount: 0, countTarget :0, countIncrement:0, 
            displayOrder : 0,
            color : "white"
        }
    },
    maxCounter = 20;

let counterColor = {
    white: "#fff",
    green: "#d3ffd0",
    yellow: "#fdffd0",
    red: "#ffd7d0",
    blue: "#d0ebff",
    violet: "#f7d0ff"
};

let counterColorSelected = "#fff";//utiliser lors de la création d'un compteur



// Objet compteur
class Counter {
    constructor(id, name, initDate, currentCount, countTarget, countIncrement,displayOrder,parentRef,color){
        this.id = id;
        this.name = name;
        this.initDate = initDate;
        this.currentCount = currentCount;
        this.countTarget = countTarget;
        this.countIncrement = countIncrement;
        this.displayOrder = displayOrder;
        this.parentRef = parentRef;
        this.color = color;

        // div container
        this.element = document.createElement("div");
        this.element.classList.add("compteur-container");
        this.element.style.backgroundColor = this.color;
        this.element.id = `counterContainer_${id}`;

        this.render();
    }



    // génération de l'élément
    render(){
        this.element.innerHTML = `
            <p class="compteur-date" id="counterDate_${this.id}">${this.initDate}</p>
            <p class="compteur-name" id="counterName_${this.id}">${this.name}</p>
            <p class="compteur-navigation">
                <button class="btn-counter" id="btn-counter-nav-up_${this.id}" onclick="eventInverseCounterUp('btn-counter-nav-up_${this.id}')"><img src="./Icons/Icon-Up.webp" alt="" srcset=""></button>
                <button class="btn-counter" id="btn-counter-nav-down_${this.id}" onclick="eventInverseCounterDown('btn-counter-nav-down_${this.id}')"><img src="./Icons/Icon-Down.webp" alt=""></button>
            </p>
            <div class="compteur-content" id="divCounterCurrentCount_${this.id}">
                <span class="current-count" id="spanCurrentCount_${this.id}">${this.currentCount}</span>
                <span id="spanCounterSeparator_${this.id}">/</span>
                <input type="number" class="compteur-target" id="inputCountTarget_${this.id}"  style="background-color: ${this.color};" placeholder="Objectif" value=${this.countTarget} onChange="onChangeCounterTargetValue('${this.id}')">
            </div>

            <div class="compteur-content">
                <button class="btn-counter" onclick="onClickDeleteCounter('${this.id}')"><img src="./Icons/Icon-Delete-color.webp" alt="" srcset=""></button>
                <button class="btn-counter" id="btnCountReset_${this.id}" onclick="onClickResetCounter('${this.id}')"><img src="./Icons/Icon-Reset.webp" alt="" srcset=""></button>
                <p class="serieTextExplication">Série de :</p>
                <input type="number" class="compteur" id="inputCountIncrement_${this.id}" placeholder="0" value=${this.countIncrement} onchange="onChangeCounterIncrement('${this.id}')">
                <button class="btn-menu btnFocus" id="btnCountIncrement_${this.id}" onclick="onClickIncrementeCounter('${this.id}')"><img src="./Icons/Icon-Accepter.webp" alt="" srcset=""></button>  
           </div>
        `;

        // Insertion
        this.parentRef.appendChild(this.element);
    }

}






async function onOpenMenuSession(){

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
async function onInsertCounterModificationInDB(modifiedData,key) {

    try {
        // Récupérer l'élément actuel depuis la base
        let existingDoc = await db.get(key);

        // Mettre à jour les champs nécessaires en conservant `_id` et `_rev`
        const updatedDoc = {
            ...existingDoc,  // Garde _id et _rev pour la mise à jour
            ...modifiedData // Remplace les valeurs avec les nouvelles
        };

        // Enregistrer les modifications dans la base
        await db.put(updatedDoc);
        console.log("[COUNTER] Activité mis à jour :");
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








// ---------------------- configuration compteur --------------------





// Valeur incrementation
function onChangeCounterIncrement(idRef) {

    // Actualise l'array
    userCounterList[idRef].countIncrement = parseInt(document.getElementById(`inputCountIncrement_${idRef}`).value) || 0;

    console.log("[COUNTER] onchangeCounter Increment");

    // Sauvegarde en base
    onInsertCounterModificationInDB(userCounterList[idRef],idRef);
}


//Valeur cible
function onChangeCounterTargetValue(idRef) {

    // Actualise l'array
    userCounterList[idRef].countTarget = parseInt(document.getElementById(`inputCountTarget_${idRef}`).value) || 0;

    console.log("[COUNTER] onChangeCounterTargetValue");

    // Sauvegarde en base
    onInsertCounterModificationInDB(userCounterList[idRef],idRef);
}






//----------------------------- NOUVEAU COMPTEUR------------------------------------


function onClickAddCounter() {
    // Reset l'emplacement du nom
    document.getElementById("newCounterName").value = "";

    // remet les éléments dans la couleur par défaut
    counterColorSelected = "white";
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
    counterColorSelected = color;
}



function onConfirmCreateCounter() {
    
    // masque le popup de création
    document.getElementById("divCreateCounter").style.display = "none";

    // Récupère le nom du compteur ou set un nom par défaut
    let newCounterName = document.getElementById("newCounterName").value || "Nouveau Compteur",
        newCounterDate = onFindDateTodayUS();

    
    // Formatage du nom en majuscule
    newCounterName = onSetToUppercase(newCounterName);


    // formatage du nom. Recherche de doublon
    let isCounterDoublonName = Object.values(userCounterList).some(counter => counter.name === newCounterName);

    if (isCounterDoublonName) {
        if (devMode === true){console.log(" [COUNTER] Doublon de nom détecté");};
        newCounterName += "_1";
    }


    // définition du displayOrder
    let newDisplayOrder = Object.keys(userCounterList).length || 0;


    let newCounterToCreate = {
        name: newCounterName, 
        initDate: newCounterDate, 
        currentCount: 0, countTarget:0, countIncrement:0,
        displayOrder : newDisplayOrder,
        color : counterColorSelected
    };

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

    let divSessionRef = document.getElementById("divSession");
    // Reset
    divSessionRef.innerHTML = "";


    // Affichage en cas d'aucune modèle
    if (Object.keys(userCounterList).length < 1) {
        divSessionRef.innerHTML = "Aucun compteur à afficher !";
        return
    }

    let counterKeysList = Object.keys(userCounterList);


    counterKeysList.forEach((key,index)=>{

        // Generation
        new Counter(key,userCounterList[key].name,onDisplayUserFriendlyDate(userCounterList[key].initDate),userCounterList[key].currentCount,userCounterList[key].countTarget,userCounterList[key].countIncrement,userCounterList[key].displayOrder,divSessionRef,counterColor[userCounterList[key].color]);


        // Gestion de l'affichage des boutons de navigation up/down
        if (index === 0) {
            //suppression du bouton up
            document.getElementById(`btn-counter-nav-up_${key}`).remove();
        }

        if (index === (counterKeysList.length - 1)){
            //suppression du bouton down
            document.getElementById(`btn-counter-nav-down_${key}`).remove();
        }

        // control des objectifs atteinds pour chaque compteur généré
        onCheckTargetReach(key); 

        // Creation de la ligne de fin pour le dernier index
        if (index === (Object.keys(userCounterList).length - 1)) {
            let newClotureList = document.createElement("span");
            newClotureList.classList.add("last-container");
            newClotureList.innerHTML = `ℹ️ Vous pouvez créer jusqu'à ${maxCounter} compteurs.`;
            divSessionRef.appendChild(newClotureList);
        }
    });

    
}




// ------------------------- INCREMENTATION ---------------------------------


// lorsque j'incremente, récupère la valeur la variable (currentCount), ajoute la nouvelle valeur(increment)
// et le nouveau résultat est mis dans total ainsi que sauvegardé en base
function onClickIncrementeCounter(idRef) {

    // Ne fait rien si l'increment est à zero ou vide
    if (userCounterList[idRef].countIncrement === 0) {
        if (devMode === true){console.log("[COUNTER] increment vide ne fait rien");};
        return

    }


    // Verrouille le bouton pour éviter action secondaire trop rapide
    //sera déverrouillé après animation
    document.getElementById(`btnCountIncrement_${idRef}`).disabled = true;

    

    // récupère ancien total et nouvelle valeur
    let oldValue = userCounterList[idRef].currentCount,
        newValue = userCounterList[idRef].countIncrement;


    // Addition
    let newTotal = oldValue + newValue;


    // Set nouveau résultat dans html, variable et update base
    // Referencement
    let spanCurrentCountRef = document.getElementById(`spanCurrentCount_${idRef}`),
        divCounterCurrentCountRef = document.getElementById(`divCounterCurrentCount_${idRef}`);

    spanCurrentCountRef.innerHTML = newTotal;//le html
    userCounterList[idRef].currentCount = newTotal;//le tableau


    //La base
    onInsertCounterModificationInDB(userCounterList[idRef],idRef);

    if (devMode === true){console.log(userCounterList);};


    // Si objectif atteind
    let isTargetReach = onCheckTargetReach(idRef);

    // ANIMATION
    onPlayIncrementAnimation(isTargetReach,spanCurrentCountRef,divCounterCurrentCountRef);

    // Notification objectif atteind
    if (isTargetReach) {
        onShowNotifyPopup(`${userCounterList[idRef].name}  validé !`);
    }

    //déverrouille le bouton pour être a nouveau disponible
    setTimeout(() => {
        document.getElementById(`btnCountIncrement_${idRef}`).disabled = false;
    }, 300);
    
}



// Si objectif non égale à zero atteind
function onCheckTargetReach(idRef) {
    let targetReach = false;

    if (userCounterList[idRef].countTarget === 0) {
       return targetReach;
    } else if (userCounterList[idRef].currentCount >= userCounterList[idRef].countTarget){
        targetReach = true;
        document.getElementById(`inputCountTarget_${idRef}`).classList.add("target-reach");
        document.getElementById(`spanCounterSeparator_${idRef}`).classList.add("target-reach");
    }
    return targetReach;
}




// ANIMATION
function onPlayIncrementAnimation(isTargetReach,countIncrementRef,divCurrentCountRef) {

    let itemToAnimRef = isTargetReach ? divCurrentCountRef : countIncrementRef;

        // Ajouter la classe pour l'animation
        itemToAnimRef.classList.add("count-animated");

        // Supprimer la classe après l'animation pour la rejouer à chaque changement
        setTimeout(() => {
            itemToAnimRef.classList.remove("count-animated");
        }, 300);
}



// ------------------------- RESET ---------------------------------

// Lorsque je reset, recupère la date du jour
// set le current count à zero,
// Actualise les éléments visual, dans la variable et en base


function onClickResetCounter(idRef) {

    //bloc le bouton jusqu'à la fin de l'animation
    document.getElementById(`btnCountReset_${idRef}`).disabled = true;

    // Récupère la date du jours
    let newInitDate = onFindDateTodayUS();


    // set les html
    //current count
    let spanCurrentCountRef = document.getElementById(`spanCurrentCount_${idRef}`);
    spanCurrentCountRef.innerHTML = 0;

    //date d'initialisation
    document.getElementById(`counterDate_${idRef}`).innerHTML = onDisplayUserFriendlyDate(newInitDate);


    // Set les variables
    userCounterList[idRef].initDate = newInitDate; 
    userCounterList[idRef].currentCount = 0;

    // Actualise la base
    onInsertCounterModificationInDB(userCounterList[idRef],idRef);



    if (devMode === true){console.log(userCounterList);};

    //retire la classe "reach" si necessaire pour le count target et le slash
    let counterTargetRef = document.getElementById(`inputCountTarget_${idRef}`),
        counterSeparatorRef = document.getElementById(`spanCounterSeparator_${idRef}`);

    if (counterTargetRef.classList.contains("target-reach")) {
        counterTargetRef.classList.remove("target-reach");
        counterSeparatorRef.classList.remove("target-reach");
    }



    // Ajouter la classe pour l'animation
    spanCurrentCountRef.classList.add("anim-reset");

    // Supprimer la classe après l'animation pour la rejouer à chaque changement
    setTimeout(() => {
        spanCurrentCountRef.classList.remove("anim-reset");

        //déverrouille le bouton à la fin de l'animation
        document.getElementById(`btnCountReset_${idRef}`).disabled = false;
    }, 300);

}



// ------------------------------------ SUPPRESSION -----------------------

let idCounterToDelete = "";
function onClickDeleteCounter(idTarget) {

    idCounterToDelete = idTarget;

    // Set le texte de confirmation
    document.getElementById("pTextConfirmDeleteCounter").innerHTML = `<b>Supprimer : ${userCounterList[idTarget].name} ?</b>`;

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
        let divSessionRef = document.getElementById("divSession");
        divSessionRef.innerHTML = "Aucun compteur à afficher !";
    }

    // Popup notification
    onShowNotifyPopup(notifyTextArray.counterDeleted);
}






// ----------------------------------- NAVIGATION -----------------------------------


function onClickCounterNavDown() {
    //récupère order de départ


}


function eventInverseCounterDown(idOrigin) {
        //récupère l'ID d'origine et son 'order'

    console.log

        console.log(onSearchCounterByDisplayOrder(idOrigin));


    //retire 1 et recupère l'id avec un 'order -1' pour la cible
    //pour l'id avec order -1 ajouter + 1 à order


    //sauvegarde les deux éléments en une seule fois


    // puis réaffiche les compteurs
}



// Recherche un counter par son display order
function onSearchCounterByDisplayOrder(displayOrderTarget) {
    dis
    const keyToReturn = Object.entries(userCounterList).find(([key, value]) => value.displayOrder === displayOrderTarget);
    return keyToReturn;
}













// Retour depuis Info
function onClickReturnFromSession() {

   
       // ferme le menu
       onLeaveMenu("Session");
   };