
let userCounterList = {
        "Counter_1": { 
            type: "Counter", name: "Compteur 1", 
            initDate:"", 
            currentCount: 0, countTarget :0, countIncrement:0, 
            displayOrder : 0,
            color : "white"
        }
    },
    maxCounter = 20,
    counterSortedKey = [],//array des clé trié par "displayOrder"
    counterEditorMode, //creation ou modification
    currentCounterEditorID,//L'id du compteur en cours de modification
    popupSessionMode;//set le mode d'utilisation du popup (removeCounter,resetAllCounter,clearSession)



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
            <div class="compteur-content-line-1">
                <button class="btn-counter" onclick="onClickModifyCounter('${this.id}')"><img src="./Icons/Icon-Setting.webp" alt="" srcset=""></button>  
                <p class="compteur-name" id="counterName_${this.id}">${this.name}</p>
                <p class="compteur-navigation">
                    <button class="btn-counter" id="btn-counter-nav-decrease_${this.id}" onclick="onClickCounterNavDecrease('${this.id}')"><img src="./Icons/Icon-nav-decrease.webp" alt="" srcset=""></button>
                    <button class="btn-counter" id="btn-counter-nav-increase_${this.id}" onclick="onClickCounterNavIncrease('${this.id}')"><img src="./Icons/Icon-nav-increase.webp" alt=""></button>
                </p>
            </div>
            <div class="compteur-content" id="divCounterCurrentCount_${this.id}">
                <span class="current-count" id="spanCurrentCount_${this.id}">${this.currentCount}</span>
                <span class="counter-target" id="spanCountTarget_${this.id}">/${this.countTarget}</span>
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

    await onLoadSessionFromDB();

    console.log(userCounterList);

    onDisplayCounter(userCounterList);
    // Gestion si max atteind
    gestionMaxCounterReach();
}
   
   
   
   
   
async function onLoadSessionFromDB() {
    userCounterList = {}; // Initialisation en objet

    try {
        const sessions = await db.get(sessionStoreName).catch(() => null);
        if (sessions) {
            userCounterList = sessions.counterList;
        }
        if (devMode === true){console.log("[DATABASE] Données chargées :", userCounterList);};
    } catch (err) {
        console.error("[DATABASE] Erreur lors du chargement des stores :", err);
    }
}

 
   


// Modification Compteur
async function onSaveSessionModificationInDB(sessionToInsert) {

    console.log("save")

    try {
        // Récupérer le store "SESSION"
        let sessionStore = await db.get(sessionStoreName);

        // Mettre à jour la liste des counter de la session
        sessionStore.counterList = sessionToInsert;

        // Sauvegarder les modifications
        await db.put(sessionStore);

        if (devMode) console.log("Store SESSION mis à jour :", sessionStore);
        return true; // Indique que la mise à jour est réussie
    } catch (err) {
        console.error("Erreur lors de la mise à jour du store SESSION :", err);
        return false; // Indique une erreur
    }
}





// ---------------------------------------- FIN FONCTION GLOBAL -------------------------








// ---------------------- configuration compteur --------------------





// Valeur incrementation
async function onChangeCounterIncrement(idRef) {

    // Actualise l'array
    userCounterList[idRef].countIncrement = parseInt(document.getElementById(`inputCountIncrement_${idRef}`).value) || 0;

    console.log("[COUNTER] onchangeCounter Increment");

    // Sauvegarde en base
    await onSaveSessionModificationInDB(userCounterList);
}






//----------------------------- NOUVEAU COMPTEUR------------------------------------


function onClickAddCounter() {
    // Reset les éléments avant set
    onResetCounterEditor();

    // Set le mode d'utilisation de l'éditeur de compteur
    counterEditorMode = "creation";
    

    // Affiche 
    document.getElementById("divEditCounter").style.display = "flex";
}






function onAnnulCounterEditor(){
    document.getElementById("divEditCounter").style.display = "none";
}


// Empeche de fermer la div lorsque l'utilisateur clique dans cette zone
function onClickDivNewPopupContent(event) {
    event.stopPropagation();
}



// Gestion des couleurs

function onChooseCounterColor(color) {
    document.getElementById("divEditCounterContent").style.backgroundColor = counterColor[color];
    counterColorSelected = color;
}



function onConfirmCounterEditor() {
    
    // filtre selon le mode d'utilisation de l'éditeur de compteur

    if (counterEditorMode === "creation"){
        eventCreateCounter();
    }else if (counterEditorMode === "modification") {
        eventSaveModifyCounter();
    }else{
        console.log("erreur dans le mode d'édition du compteur")
    }

}


async function eventCreateCounter() {
    
    // masque le popup de création
    document.getElementById("divEditCounter").style.display = "none";

    // Formatage
    let counterData = onFormatNewCounter()

    // Obtenir le prochain ID
    let nextId = await getNextIdNumber(counterCountIDStoreName);
        nextId = `counter_${nextId}`;

    // Ajout du nouveau compteur à l'array
    userCounterList[nextId] = counterData;

    // Enregistrement
    eventInsertNewCompteur();

}



//Séquence d'insertion d'un nouveau compteur

async function eventInsertNewCompteur() {

    console.log(userCounterList);

    // Sauvegarde en base
    await onSaveSessionModificationInDB(userCounterList);

    // fonction de création affichage des compteurs
    onDisplayCounter(userCounterList);
    
    // Gestion si max atteind
    gestionMaxCounterReach();

    // Popup notification
    onShowNotifyPopup(notifyTextArray.counterCreated);

}



function onFormatNewCounter() {

    // Récupère le nom du compteur ou set un nom par défaut
    let newCounterName = document.getElementById("inputEditCounterName").value || "Nouveau Compteur",
        newCounterDate = onFindDateTodayUS();
    
    // Formatage du nom en majuscule
    newCounterName = onSetToUppercase(newCounterName);


    // formatage du nom. Recherche de doublon
    let isCounterDoublonName = Object.values(userCounterList).some(counter => counter.name === newCounterName);

    if (isCounterDoublonName) {
        if (devMode === true){console.log(" [COUNTER] Doublon de nom détecté");};
        newCounterName += "_1";
    }

    // Récupère l'objectif ou set 0
    let newCountTarget = parseInt(document.getElementById("inputEditCounterTarget").value) || 0;



    // définition du displayOrder
    let newDisplayOrder = Object.keys(userCounterList).length || 0;


    let formatedCounter = {
        name: newCounterName, 
        initDate: newCounterDate, 
        currentCount: 0, countTarget: newCountTarget, countIncrement:0,
        displayOrder : newDisplayOrder,
        color : counterColorSelected
    };

    return formatedCounter;

}




// Modification de compteur
function onClickModifyCounter(idRef) {
    counterEditorMode = "modification";
    currentCounterEditorID = idRef;

    // set les éléments
    document.getElementById("inputEditCounterName").value = userCounterList[idRef].name;
    document.getElementById("inputEditCounterTarget").value = userCounterList[idRef].countTarget;
    document.getElementById("divEditCounterContent").style.backgroundColor = counterColor[userCounterList[idRef].color];
    counterColorSelected = userCounterList[idRef].color;

    // Affiche 
    document.getElementById("divEditCounter").style.display = "flex";
}





async function eventSaveModifyCounter() {

    // masque le popup de création
    document.getElementById("divEditCounter").style.display = "none";

    // Formatage
    let counterData = onFormatModifyCounter();

    // Enregistrement dans l'array
    userCounterList[currentCounterEditorID].name = counterData.name;
    userCounterList[currentCounterEditorID].countTarget = counterData.countTarget;
    userCounterList[currentCounterEditorID].color = counterData.color;

    // Actualisation de l'affichage
    document.getElementById(`counterName_${currentCounterEditorID}`).innerHTML = counterData.name;
    document.getElementById(`counterContainer_${currentCounterEditorID}`).style.backgroundColor = counterColor[counterData.color];
    document.getElementById(`spanCountTarget_${currentCounterEditorID}`).innerHTML = `/${counterData.countTarget}`;
    

    // Enregistrement en base
    await onSaveSessionModificationInDB(userCounterList);


}



function onFormatModifyCounter() {

    // Récupère le nom du compteur ou set un nom par défaut
    let newCounterName = document.getElementById("inputEditCounterName").value || "Nouveau Compteur",
        newCounterDate = onFindDateTodayUS();
    
    // Formatage du nom en majuscule
    newCounterName = onSetToUppercase(newCounterName);

    // Récupère l'objectif ou set 0
    let newCountTarget = parseInt(document.getElementById("inputEditCounterTarget").value) || 0;


    let formatedCounter = {
        name: newCounterName, 
        initDate: newCounterDate, 
        currentCount: 0, countTarget: newCountTarget, countIncrement:0,
        displayOrder : 0,
        color : counterColorSelected
    };

    return formatedCounter;

}





//

// Gestion si le nombre maximal de compteur atteints
function gestionMaxCounterReach() {
        // Gestion bouton new compteur
        document.getElementById("btnAddNewCounter").disabled = Object.keys(userCounterList).length >= maxCounter ? true : false;
}



// l'affichage des compteurs de fait sur le trie des "displayOrder"

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


    // récupère la liste des clé trié par displayOrder
    counterSortedKey = [];

    counterSortedKey = getSortedKeysByDisplayOrder(userCounterList);

    counterSortedKey.forEach((key,index)=>{

        // Generation
        new Counter(key,userCounterList[key].name,onDisplayUserFriendlyDate(userCounterList[key].initDate),userCounterList[key].currentCount,userCounterList[key].countTarget,userCounterList[key].countIncrement,userCounterList[key].displayOrder,divSessionRef,counterColor[userCounterList[key].color]);


        // Gestion de l'affichage des boutons de navigation up/down
        if (index === 0) {
            //suppression du bouton up
            document.getElementById(`btn-counter-nav-decrease_${key}`).disabled = true;
        }

        if (index === (counterSortedKey.length - 1)){
            //suppression du bouton down
            document.getElementById(`btn-counter-nav-increase_${key}`).disabled = true;
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

// Fonction de trie par displayOrder et ne retourner qu'un tableau de clé trié
function getSortedKeysByDisplayOrder(counterList) {
    return Object.entries(counterList)
        .sort(([, a], [, b]) => a.displayOrder - b.displayOrder)
        .map(([key]) => key);
}

// ------------------------- INCREMENTATION ---------------------------------


// lorsque j'incremente, récupère la valeur la variable (currentCount), ajoute la nouvelle valeur(increment)
// et le nouveau résultat est mis dans total ainsi que sauvegardé en base
async function onClickIncrementeCounter(idRef) {

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


    if (devMode === true){console.log(userCounterList);};


    // Si objectif atteind
    let isTargetReach = onCheckTargetReach(idRef);

    // ANIMATION
    onPlayIncrementAnimation(isTargetReach,spanCurrentCountRef,divCounterCurrentCountRef);

    // Notification objectif atteind
    if (isTargetReach) {
        onShowNotifyPopup(`${userCounterList[idRef].name}  validé !`);
    }

    //La base
    await onSaveSessionModificationInDB(userCounterList);

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
        document.getElementById(`spanCountTarget_${idRef}`).classList.add("target-reach");
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


async function onClickResetCounter(idRef) {

    //bloc le bouton jusqu'à la fin de l'animation
    document.getElementById(`btnCountReset_${idRef}`).disabled = true;

    // Récupère la date du jours
    let newInitDate = onFindDateTodayUS();


    // set les html
    //current count
    let spanCurrentCountRef = document.getElementById(`spanCurrentCount_${idRef}`);
    spanCurrentCountRef.innerHTML = 0;

    //affichage date d'initialisation désactivée
    // document.getElementById(`counterDate_${idRef}`).innerHTML = onDisplayUserFriendlyDate(newInitDate);


    // Set les variables
    userCounterList[idRef].initDate = newInitDate; 
    userCounterList[idRef].currentCount = 0;

    // Actualise la base
    await onSaveSessionModificationInDB(userCounterList);

    if (devMode === true){console.log(userCounterList);};

    //retire la classe "reach" si necessaire pour le count target et le slash
    let counterTargetRef = document.getElementById(`spanCountTarget_${idRef}`);

    if (counterTargetRef.classList.contains("target-reach")) {
        counterTargetRef.classList.remove("target-reach");
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


// RESET ALL COUNTER


function onClickResetAllCounter() {

    // Set le mode de popup
    onSetSessionPopupMode("resetAllCounter");
}


async function eventResetAllCounter() {
    
    // Boucle sur la liste des key
    //Pour chaque éléments passe la variable à zero et set le texte
    counterSortedKey.forEach(key=>{
        userCounterList[key].currentCount = 0;
        document.getElementById(`spanCurrentCount_${key}`).innerHTML = 0;
    });

    //sauvegarde dans la base
    await onSaveSessionModificationInDB(userCounterList);

    // Notification utilisateur  
    onShowNotifyPopup(notifyTextArray.sessionReset);
}


// ------------------------------------ SUPPRESSION -----------------------






//Lors d'une suppression, il faut également décrémenter les display order des counters suivants



let idCounterToDelete = "";
function onClickDeleteCounter(idTarget) {

    idCounterToDelete = idTarget;

    // Set le mode de popup
    onSetSessionPopupMode("removeCounter");
}



async function eventDeleteCounter(){
    //suppression dans la variable
    delete userCounterList[idCounterToDelete];

    // supression htlm
    document.getElementById(`counterContainer_${idCounterToDelete}`).remove();


    // Gestion si max atteind ou non
    gestionMaxCounterReach();

    // traitement display order pour les counters suivants
    onChangeDisplayOrderFromDelete(idCounterToDelete);


    // Affichage en cas d'aucun compteur
    if (Object.keys(userCounterList).length < 1) {
        let divSessionRef = document.getElementById("divSession");
        divSessionRef.innerHTML = "Aucun compteur à afficher !";
    }

    // Popup notification
    onShowNotifyPopup(notifyTextArray.counterDeleted);


    // Actualisation base
    await onSaveSessionModificationInDB(userCounterList);

}


async function onChangeDisplayOrderFromDelete(idOrigin) {
    // recupère l'index d'origine dans l'array des key
    let deletedCounterIndex = counterSortedKey.indexOf(idOrigin);

    console.log("deletedCounterIndex :",deletedCounterIndex);

    // Boucle jusquà la fin et décrémente les displayOrder et stocke en même temps les key to save
    for (let i = (deletedCounterIndex + 1); i < counterSortedKey.length; i++) {
        // Increment
        userCounterList[counterSortedKey[i]].displayOrder--
    }

    // retire la key concernée dans l'array
    counterSortedKey.splice(deletedCounterIndex,1);

}






// ------------------------------- POPUP SESSION--------------------------------------





function onSetSessionPopupMode(mode) {
    
    popupSessionMode = mode;

    let textPopup,
        imgPopupUrl;

    switch (popupSessionMode) {
        case "removeCounter":
            textPopup = `<b>Supprimer : ${userCounterList[idCounterToDelete].name} ?</b>`;
            imgPopupUrl = "./Icons/Icon-Delete-color.webp";
            break;
        case "resetAllCounter":
            textPopup = "Réinitialiser tous les compteurs ?";
            imgPopupUrl = "./Icons/Icon-Reset.webp";
            break;
        case "clearSession":
            textPopup = "Supprimer la session ?";
            imgPopupUrl ="./Icons/Icon-Delete-color.webp";
            break;
    
        default:
            break;
    }

    // Set le texte de confirmation
    document.getElementById("pTextConfirmPopupSession").innerHTML = textPopup;

    // Set l'icone
    document.getElementById("imgComfirmPopupSession").src = imgPopupUrl;

    // Affiche le popup
    document.getElementById("divPopupConfirmSession").classList.add("show");

}

//Annule le popup de confirmation
function onAnnulPopUPConfirmSession(event) {
    document.getElementById("divPopupConfirmSession").classList.remove("show");
}



// Confirme le popup de session
function onConfirmPopupSession(event) {
    event.stopPropagation();
    document.getElementById("divPopupConfirmSession").classList.remove("show");

    // Filtre selon le mode d'ouverture du popup
    switch (popupSessionMode) {
        case "removeCounter":
            eventDeleteCounter();
            break;
        case "resetAllCounter":
            eventResetAllCounter();
            break;
        case "clearSession":

            break;
    
        default:
            break;
    }
   
}


// ----------------------------------- NAVIGATION -----------------------------------


async function onClickCounterNavDecrease(idOrigin) {

    // Fait un switch entre les deux éléments

    // Récupère l'id de l'élément que l'on va devoir incrementer
    let keyItemToIncrease = onSearchCounterKeyByDisplayOrder(userCounterList[idOrigin].displayOrder -1);

    // Item to decrease
    userCounterList[idOrigin].displayOrder--;


    //Item to increase
    userCounterList[keyItemToIncrease].displayOrder++;


    // réaffiche les compteurs
    onDisplayCounter();

    //sauvegarde en base
    await onSaveSessionModificationInDB(userCounterList);


}


async function onClickCounterNavIncrease(idOrigin) {

    // Fait un switch entre les deux éléments

    // Récupère l'id de l'élément que l'on va devoir décrementer
    let keyItemToDecrease = onSearchCounterKeyByDisplayOrder(userCounterList[idOrigin].displayOrder + 1);

    // Item to Increase
    userCounterList[idOrigin].displayOrder++;


    //Item to decrease
    userCounterList[keyItemToDecrease].displayOrder--;


    // réaffiche les compteurs
    onDisplayCounter();

    // SAUVEGARDE
    await onSaveSessionModificationInDB(userCounterList);

}




// Recherche la key d'un par son display order
function onSearchCounterKeyByDisplayOrder(displayOrderTarget) {
    return Object.keys(userCounterList).find(key => userCounterList[key].displayOrder === displayOrderTarget) || null;
}












// Reset les éléments de l'éditeur de compteur
function onResetCounterEditor() {
    // Reset l'emplacement du nom
    document.getElementById("inputEditCounterName").value = "";

    // Reset l'objectif
    document.getElementById("inputEditCounterTarget").value = 0;

    // remet les éléments dans la couleur par défaut
    counterColorSelected = "white";
    document.getElementById("divEditCounterContent").style.backgroundColor = counterColorSelected;
}




// ----------------------------- ENVOIE VERS ACTIVITE ------------------------------------


function onClickSendSessionToActivity() {
    onGenerateFakeSelectSession();
}




async function onSendSessionToActivity(activityTarget) {
    
    let sessionText = "";

    //Boucle sur les éléments
    counterSortedKey.forEach(key=>{

        // Pour chaque élément crée une ligne avec les données
        let nameFormated = onSetToLowercase(userCounterList[key].name);
        nameFormated = onSetFirstLetterUppercase(nameFormated);

        let textToAdd = `${nameFormated} : ${userCounterList[key].currentCount}\n`;

        sessionText = sessionText + textToAdd;

    });

    console.log(sessionText);

    
    //Remplit une variable avec des données pour une nouvelle activité
    let activityGenerateToInsert = {
        name : activityTarget,
        date : onFindDateTodayUS(),
        location : "",
        distance : "",
        duration : "00:00:00",
        comment : sessionText,
        divers:{},
        isPlanned : false
    };

    // Lance la sauvegarde d'une nouvelle activité
    await  eventInsertNewActivity(activityGenerateToInsert,true);
 

}









// Objet fake option
class FakeOptionSession {
    constructor(activityName, displayName, imgRef, classList, parentRef, isLastFavourite) {
        this.activityName = activityName;
        this.displayName = displayName;
        this.imgRef = imgRef;
        this.classList = classList;
        this.parentRef = parentRef;
        this.isLastFavourite = isLastFavourite; 

        // div container
        this.element = document.createElement("div");
        this.element.classList.add("fake-opt-item-container");

        // Ajout des traits pour le dernier favori
        if (this.isLastFavourite) {
            this.element.classList.add("fake-opt-item-last-favourite");
        }

        // Fonction
        this.element.onclick = (event) => {
            event.stopPropagation();
            onSendSessionToActivity(this.activityName);
            // affichage
            document.getElementById("divFakeSelectSession").style.display = "none";
        };

        this.render();
    }

    // génération de l'élément
    render() {
        this.element.innerHTML = `
            <img class="fake-opt-item" src="${this.imgRef}">
            <span class="${this.classList}">${this.displayName}</span>
            <div class="radio-button-fake"></div>
        `;

        // Insertion
        this.parentRef.appendChild(this.element);
    }
}




// génération du fake selection d'activité pour l'envoie des compteurs

function onGenerateFakeSelectSession() {
    let parentRef = document.getElementById("divFakeSelectSessionList");

    parentRef.innerHTML = "";


    // Insert d'abord la liste des favoris
    userFavoris.forEach((e,index)=>{

        let displayName = `* ${activityChoiceArray[e].displayName}`,
            imgRef = activityChoiceArray[e].imgRef,
            classList = "fake-opt-item fake-opt-item-favoris";

            isLastFavourite = index === (userFavoris.length - 1);

        new FakeOptionSession(e,displayName,imgRef,classList,parentRef,isLastFavourite);
    });



    // Puis toutes les type d'activités
    let activitySortedKey = Object.keys(activityChoiceArray);
    activitySortedKey.sort();


    activitySortedKey.forEach((e,index)=>{
        let displayName = `${activityChoiceArray[e].displayName}`,
            imgRef = activityChoiceArray[e].imgRef,
            classList = "fake-opt-item";

        new FakeOptionSession(e,displayName,imgRef,classList,parentRef,false);
    });


    // affichage
    document.getElementById("divFakeSelectSession").style.display = "flex";
}




// Annule envoie vers activité
function onCloseFakeSelectSession(event) {
    document.getElementById("divFakeSelectSession").style.display = "none";
}


// Retour depuis Info
function onClickReturnFromSession() {

   
    // ferme le menu
    onLeaveMenu("Session");
};



