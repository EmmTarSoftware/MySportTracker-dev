
function onOpenMenuGestData() {

    
};




// ---------------------     EXPORT -------------------------------------

//Lors d'un export manual ou auto
// Step 1 sauvegarde de la date du jour dans setting
//Step 2 lancement de export

// La date du jour pour l'export
let exportDate,
    exportTime,//format 00:00
    exportTimeFileName;//format 0000


function eventSaveData(isAutoSave) {

    // Sauvegarde la date dans setting
    // Set la date du jour ainsi que l'heure
    exportDate = onFindDateTodayUS();

    // Set l'heure mais en retirant les ":" pour l'enregistrement du nom de fichier
    exportTime = onGetCurrentTime();
    exportTimeFileName = exportTime.replace(":","");


    if (devMode === true){
        console.log("[SAVE] Demande d'export des données");
        console.log("[SAVE] demande automatique ? : " + isAutoSave);
        console.log("[SAVE] sauvegarde de la date dans les setting");
    };

    let transaction = db.transaction(settingStoreName,"readwrite");
    let store = transaction.objectStore(settingStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(1));

    modifyRequest.onsuccess = function () {
        if (devMode === true){console.log("modifyRequest = success");};

        let modifiedData = modifyRequest.result[0];

        if (isAutoSave) {
            modifiedData.lastAutoSaveDate = exportDate;
            modifiedData.lastAutoSaveTime = exportTime;
        }else{
            modifiedData.lastManualSaveDate = exportDate;
            modifiedData.lastManualSaveTime = exportTime;
        }

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            if (devMode === true){console.log("[ DATABASE SAVE] insert ModifiedData = success");};

        };

        insertModifiedData.onerror = function (){
            if (devMode === true){console.log("[ DATABASE SAVE] insert ModifiedData = error",insertModifiedData.error); };
        };
    };

    modifyRequest.onerror = function(){
        if (devMode === true){console.log("[ DATABASE SAVE] ModifyRequest = error");};
    };

    transaction.oncomplete = function(){
        if (devMode === true){console.log("[ DATABASE SAVE] Transaction insertion modification setting complété !");};


        // suite à enregistrement de la date, export des données
        exportData(isAutoSave);
    };
}





// Fonction pour exporter tous les stores de la base de données
function exportData(isAutoSave) {
    

    if (devMode === true) {console.log("Demande d'exportation des données");};

    // Créer un objet pour stocker toutes les données des stores
    let allStoresData = {};

    // Parcourir tous les stores
    let completedStores = 0;

    storeNames.forEach(storeName => {
        let transaction = db.transaction([storeName], 'readonly');
        let store = transaction.objectStore(storeName);

        let exportRequest = store.getAll();

        exportRequest.onsuccess = function() {
            // Ajouter les données de chaque store dans l'objet
            allStoresData[storeName] = exportRequest.result;

            completedStores++;

            // Si tous les stores sont exportés, on les télécharge
            if (completedStores === storeNames.length) {
                
                // Le nommage ne sera pas le même si sauvegarde automatique
                if (isAutoSave) {
                    downloadJSON(allStoresData, `MSS_AUTOSAVE_${exportDate}_${exportTimeFileName}.json`);
                    if (devMode === true) {console.log("[AUTOSAVE] Fin de sauvegarde automatique. Lancement activité liste ");};

                    eventSaveResult(isAutoSave);

                    // La sauvegarde automatique à lieu au lancement de l'application
                    // Ensuite la liste d'activité est chargé. Ne pas retirer la fonction ci-desous
                    // Premiere remplissage de la base avec le formation de trie par défaut
                    onUpdateActivityBddList(false);
                }else{
                    downloadJSON(allStoresData, `MSS_${exportDate}_${exportTimeFileName}_${userInfo.pseudo}.json`);
                    eventSaveResult(isAutoSave);
                }
            }
        };

        exportRequest.onerror = function(error) {
            console.log(`Erreur lors de l'exportation des données du store ${storeName}: `, error);
        };
    });
};

// Fonction de téléchargement
function downloadJSON(data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};






// ----------------------------     sauvegarde automatique     ----------------------------------







// Verification condition autosave
function onCheckAutoSaveCondition() {

    if (devMode === true) {console.log("[AUTOSAVE] Vérification des conditions de sauvegarde");};

    let isSaveRequired = false;

    // Si cookies last date est vide = AutoSAVE
    if (userSetting.lastAutoSaveDate === "noSet") {
        // Lancement fonction autoSave
        if (devMode === true) {console.log("[AUTOSAVE] date dans userSetting noSet demande de sauvegarde");};
        eventSaveData(true);
    }else{
        // sinon controle l'intervalle entre date du jour et date derniere sauvegarde

        isSaveRequired = compareDateAutoSave(userSetting.lastAutoSaveDate,userSetting.autoSaveFrequency);

        if (devMode === true) {
            console.log("[AUTOSAVE] Date derniere sauvegarde existante dans userSETTING");
        };


        if (isSaveRequired) {
            if (devMode === true) {console.log("[AUTOSAVE] date plus valide. Demande de sauvegarde");};
            eventSaveData(true);
        }else{
            if (devMode === true) {console.log("[AUTOSAVE] date encore valide. Pas de sauvegarde");};
            // Premiere remplissage de la base avec le formation de trie par défaut
            onUpdateActivityBddList(false);
        }
    }

}

// fonction pour savoir si la date d'ancienne sauvegarde est encore valide ou non

function compareDateAutoSave(lastDateSave, frequency) {
    // Convertir la date de sauvegarde en un objet Date
    const d1 = new Date(lastDateSave); 
    const d2 = new Date(); // Date actuelle

    // Vérifier si d1 est une date valide
    if (isNaN(d1.getTime())) {
        console.error("[AUTOSAVE] La date de sauvegarde est invalide :", lastDateSave);
        return false; // Sortie pour éviter des comportements imprévisibles
    }

    // Calculer la différence en millisecondes
    const differenceMs = Math.abs(d2 - d1);

    // Convertir la différence en jours
    const differenceEnJours = differenceMs / (1000 * 60 * 60 * 24);

    // Mode débogage
    if (devMode === true) { 
        console.log("[AUTOSAVE] Comparaison des dates");
        console.log("[AUTOSAVE] Date de dernière sauvegarde :", d1);
        console.log("[AUTOSAVE] Date du jour :", d2);
        console.log("[AUTOSAVE] Fréquence (jours) :", frequency);
        console.log("[AUTOSAVE] Différence en jours :", differenceEnJours);
    }

    // Vérifier si la différence dépasse le seuil
    return differenceEnJours >= frequency;
}




function eventSaveResult(isAutoSave){
    if (devMode === true) {console.log("[AUTOSAVE] Fin de sauvegarde, actualisation set la date au bon emplacement");};

    if (isAutoSave) {
        // Mise à jour du texte et de la variable userSetting ici
        userSetting.lastAutoSaveDate = exportDate;
        userSetting.lastAutoSaveTime = exportTime;
        document.getElementById("pSettingLastAutoSaveDate").innerHTML = `Le ${onFormatDateToFr(userSetting.lastAutoSaveDate)} à ${userSetting.lastAutoSaveTime}`;
    }else{
        // Mise à jour du texte et de la variable userSetting ici
        userSetting.lastManualSaveDate = exportDate;
        userSetting.lastManualSaveTime = exportTime;
        document.getElementById("pGestDataLastExportDate").innerHTML = `Date dernier export : le ${onFormatDateToFr(userSetting.lastManualSaveDate)} à ${userSetting.lastManualSaveTime}`;
    }

    console.log(userSetting);
};




// -------------------------------- IMPORT -----------------------------------------------------







let baseStoreCount = 0;

// Fonction d'importation depuis JSON
function importBdD(inputRef, pResultRef) {
    const fileInput = document.getElementById(inputRef);
    let textResultRef = document.getElementById(pResultRef);

    baseStoreCount = 0;
    onSetLockGestDataButton(true);

    if (fileInput.files.length > 0) {
        textResultRef.innerHTML = "Veuillez patienter...";
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                // Charger et analyser le JSON
                const jsonData = JSON.parse(e.target.result);

                // Commencer une transaction en lecture/écriture pour chaque store
                storeNames.forEach(storeName => {
                    baseStoreCount++;

                    if (jsonData[storeName]) {
                        const transaction = db.transaction([storeName], 'readwrite');
                        const objectStore = transaction.objectStore(storeName);

                        // Supprimer les anciennes données
                        const clearRequest = objectStore.clear();

                        clearRequest.onsuccess = function () {
                            // Vérification du format des données avant l'ajout
                            if (Array.isArray(jsonData[storeName])) {
                                jsonData[storeName].forEach(item => {
                                    objectStore.add(item);
                                });

                                transaction.oncomplete = function () {
                                    console.log(`Imported ${storeName} to IndexedDB successfully.`);


                                    // Lorsque toutes les transactions sont effectuée
                                    if (baseStoreCount === storeNames.length) {
                                        eventImportDataSucess(pResultRef);
                                    }
                                };

                                transaction.onerror = function (error) {
                                    console.error(`Erreur lors de l'importation de ${storeName}:`, error);
                                    textResultRef.innerHTML = `Erreur lors de l'importation de ${storeName}.`;
                                    onSetLockGestDataButton(false);
                                };
                            } else {
                                console.error(`${storeName} n'est pas un tableau valide.`);
                                textResultRef.innerHTML = `Erreur dans le format des données pour ${storeName}.`;
                                onSetLockGestDataButton(false);


                            }
                        };
                    } else {
                        console.error(`Le store ${storeName} est absent du fichier JSON.`);
                        // Lorsque toutes les transactions sont effectuée
                        if (baseStoreCount === storeNames.length) {
                            eventImportDataSucess(pResultRef);
                        }
                    }
                });
            } catch (error) {
                console.error('Erreur lors du parsing du JSON:', error);
                textResultRef.innerHTML = "Erreur d'importation.";
                onSetLockGestDataButton(false);
            }
        };

        reader.readAsText(selectedFile);
    } else {
        console.error('Aucun fichier sélectionné.');
        textResultRef.innerHTML = "Aucun fichier sélectionné !";
        onSetLockGestDataButton(false);
    }
};





// Action lors du succes d'un import
function eventImportDataSucess() {

    onDisplayTextDataBaseEvent(false);
    onShowNotifyPopup(notifyTextArray.importSuccess);
    setTimeout(() => {
        location.reload();
      }, "2000");
}





// -----------------------------------------------  Suppression des données de la base ----------------------------






// Demande de suppression
function onClickDeleteDataBaseFromGestData() {
    if (devMode === true) {console.log("Demande de suppression des données de la base");};

    document.getElementById("divConfirmDeleteDataBase").classList.add("show");

    onChangeDisplay([],[],[],["divGestData","divBtnGestData"],[],[],[]);
}



// Demande de confirmation
function onConfirmDeleteDataBase(event) {
    
    event.stopPropagation();
    if (devMode === true) {console.log("Confirmation de la demande de suppression des données");};

    document.getElementById("divConfirmDeleteDataBase").classList.remove("show");
    onChangeDisplay([],[],[],[],["divGestData","divBtnGestData"],[],[]);

    // Verrouillage des boutons du menu Gestion des données
    onSetLockGestDataButton(true);


    onDeleteBDD();
}



// Annuation de la demande
function onCancelDeleteDataBase(params) {
    if (devMode === true) {console.log("annulation de la demande de suppression des données");};

    document.getElementById("divConfirmDeleteDataBase").classList.remove("show");
    onChangeDisplay([],[],[],[],["divGestData","divBtnGestData"],[],[]);
}





// Fonction de suppression de la base et des favoris
function onDeleteBDD() {
   
    onDisplayTextDataBaseEvent(true);

    if (devMode === true) {console.log("Lancement de la suppression");};
    // Les cookies 
    localStorage.removeItem(cookiesUserFavorisName);
    localStorage.removeItem(cookiesConditionUtilisation_keyName);
    localStorage.removeItem(cookiesDevModeName);
    localStorage.removeItem(cookiesBddVersion_KeyName);
    localStorage.removeItem('MSS_notifyPermission');
    // La base de donnée
    let requestDelete = indexedDB.deleteDatabase(dbName);

    // Relance l'application
    setTimeout(() => {
        location.reload();
    }, 2000);
};







// ------------------------------------ fonction générales --------------------------





// Verrouillage interraction utilisateur pendant les actions
function onSetLockGestDataButton(isDisable){
    if (devMode === true) {console.log("Gestion de blocage ou déblocage des boutons : " + isDisable);};


    let buttonArray = [
        "btnExportBdD",
        "fileInputJsonTask",
        "btnImportBdD",
        "btnDeteteBdd",
        "btnReturnFromGestData"
    ]


    buttonArray.forEach(e=>{
        document.getElementById(e).disabled = isDisable;
        document.getElementById(e).style.visibility = isDisable ?"hidden" :"visible";
    })
}

// Evenement patientez pendant la suppression de la base ou son chargement
function onDisplayTextDataBaseEvent(isDelete) {

    let divGestDataRef = document.getElementById("divGestData");

    // Vide la div gestion des données
    divGestDataRef.innerHTML = "";


    // Creation des éléments pour patienter

    let newDiv = document.createElement("div");
    newDiv.className = "center";

    let newImg = document.createElement("img");
    newImg.src = "./Icons/Icon-wait.webp";
    newImg.className = "waiting";

    let newText = document.createElement("p");
    newText.innerHTML =  isDelete ? "Suppression en cours, veuillez patientez... ": "Import Réussi ! Veuillez patienter...";
    newText.className = "waiting";

    // Insertion
    newDiv.appendChild(newImg);
    newDiv.appendChild(newText);

    divGestDataRef.appendChild(newDiv);
}


// Retour depuis Gestion des données
function onClickReturnFromGestData() {
    // ferme le menu
    onLeaveMenu("GestData");
};