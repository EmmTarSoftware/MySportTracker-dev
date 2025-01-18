// La date du jour pour l'export
let exportDate;


// Fonction pour exporter tous les stores de la base de données
function exportData() {
    // Set la date du jour
    exportDate = onFindDateTodayUS();

    console.log("Demande d'exportation des données");

    // Créer un objet pour stocker toutes les données des stores
    let allStoresData = {};

    // Nom des stores à exporter
    let storeNames = [activityStoreName, profilStoreName, rewardsStoreName]; 

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
    onSetLockSettingButton(true);

    if (fileInput.files.length > 0) {
        textResultRef.innerHTML = "Veuillez patienter...";
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            

            try {
                // Charger et analyser le JSON
                const jsonData = JSON.parse(e.target.result);

                // Nom des stores à importer
                let storeNames = [activityStoreName, profilStoreName, rewardsStoreName]; 

                // Commencer une transaction en lecture/écriture pour chaque store
                storeNames.forEach(storeName => {
                    if (jsonData[storeName]) {
                        const transaction = db.transaction([storeName], 'readwrite');
                        const objectStore = transaction.objectStore(storeName);

                        // Supprimer les anciennes données
                        const clearRequest = objectStore.clear();

                        clearRequest.onsuccess = function () {
                            // Ajouter les nouvelles données
                            jsonData[storeName].forEach(function (item) {
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
                                textResultRef.innerHTML = "Erreur lors de l'importation.";
                                onSetLockSettingButton(false);
                            };
                        };
                    }
                });
            } catch (error) {
                console.error('Erreur lors du parsing du JSON:', error);
                textResultRef.innerHTML = "Erreur d'importation.";
                onSetLockSettingButton(false);
            }
        };

        reader.readAsText(selectedFile);
    } else {
        console.error('Aucun fichier sélectionné.');
        textResultRef.innerHTML = "Aucun fichier sélectionné !";
        onSetLockSettingButton(false);
    }
};

// Action lors du succes d'un import
function eventImportDataSucess(textResultRef) {
    document.getElementById(textResultRef).innerHTML = "Import Réussi ! Veuillez patienter...";
    onShowNotifyPopup(notifyTextArray.exportSuccess);
    setTimeout(() => {
        location.reload();
      }, "2000");
}

function onSetLockSettingButton(isDisable){
    if (devMode === true) {console.log("Gestion de blocage ou déblocage des boutons : " + isDisable);};


    let buttonArray = [
        "selectSettingCommentModePlanned",
        "selectSettingCommentModeDone",
        "btnExportBdD",
        "fileInputJsonTask",
        "btnImportBdD",
        "btnDeteteBdd",
        "btnReturnFromSetting"
    ]


    buttonArray.forEach(e=>{
        document.getElementById(e).disabled = isDisable;
        document.getElementById(e).style.visibility = isDisable ?"hidden" :"visible";
    })
}