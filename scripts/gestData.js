
function onOpenMenuGestData() {

    
};




// ---------------------     EXPORT -------------------------------------







// La date du jour pour l'export
let exportDate;

// Fonction pour exporter tous les stores de la base de données
function exportData() {
    // Set la date du jour
    exportDate = onFindDateTodayUS();

    console.log("Demande d'exportation des données");

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
                downloadJSON(allStoresData, `MSS_${exportDate}_${userInfo.pseudo}.json`);
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
                                    baseStoreCount++;
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
                        textResultRef.innerHTML = `Le store ${storeName} est absent du fichier JSON.`;
                        onSetLockGestDataButton(false);
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
    localStorage.removeItem(cookiesSettingCommentDoneMode_Name);
    localStorage.removeItem(cookiesSettingCommentPlannedMode_Name);


    // La base de donnée
    let requestDelete = indexedDB.deleteDatabase(dbName);

    // Relance l'application
    setTimeout(() => {
        location.reload();
    }, 2000);
};







// ------------------------------------ fonction générales --------------------------



// Action lors du succes d'un import
function eventImportDataSucess(textResultRef) {
    onDisplayTextDataBaseEvent(false);
    onShowNotifyPopup(notifyTextArray.exportSuccess);
    setTimeout(() => {
        location.reload();
      }, "2000");
}


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