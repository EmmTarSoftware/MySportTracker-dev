
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


async function eventSaveData(isAutoSave) {

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

   

    if (isAutoSave) {
        userSetting.lastAutoSaveDate = exportDate;
        userSetting.lastAutoSaveTime = exportTime;
    }else{
        userSetting.lastManualSaveDate = exportDate;
        userSetting.lastManualSaveTime = exportTime;
    }

    // Enregistrement date/heure dans les paramètres
    await onInsertSettingModificationInDB(userSetting);

    // suite à enregistrement de la date, export des données
    await exportDBToJson(isAutoSave);
    eventSaveResult(isAutoSave);
}



async function exportDBToJson(isAutoSave) {
    if (devMode === true) {console.log("Demande d'exportation des données");};
    try {
        const result = await db.allDocs({ include_docs: true });

        // Extraire uniquement les documents
        const exportedData = result.rows.map(row => row.doc);

        // Convertir en JSON
        const jsonData = JSON.stringify(exportedData, null, 2);


        // Set le nom du fichier
        let fileName = "";
        if (isAutoSave) {
            fileName =  `MSS_AUTOSAVE_${exportDate}_${exportTimeFileName}.json`;
        }else{
            fileName =  `MSS_${exportDate}_${exportTimeFileName}_${userInfo.pseudo}.json`;
        }


        // Télécharger le fichier JSON
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log("📂 Base de données exportée avec succès !");
    } catch (err) {
        console.error("❌ Erreur lors de l'exportation :", err);
    }
}




// ----------------------------     sauvegarde automatique     ----------------------------------







// Vérification condition autosave
async function onCheckAutoSaveCondition() {
    if (devMode === true) {
        console.log("[AUTOSAVE] Vérification des conditions de sauvegarde");
    }

    let isSaveRequired = false;

    // Si cookies last date est vide = AutoSAVE
    if (userSetting.lastAutoSaveDate === "noSet") {
        if (devMode === true) {
            console.log("[AUTOSAVE] date dans userSetting noSet, demande de sauvegarde");
        }
        isSaveRequired = true;
    } else {
        // Sinon, contrôle l'intervalle entre date du jour et date dernière sauvegarde
        isSaveRequired = compareDateAutoSave(userSetting.lastAutoSaveDate, userSetting.autoSaveFrequency);
    }

    return isSaveRequired;
}

// Fonction pour savoir si la date d'ancienne sauvegarde est encore valide ou non
function compareDateAutoSave(lastDateSave, frequency) {
    const d1 = new Date(lastDateSave);
    const d2 = new Date(); // Date actuelle

    if (isNaN(d1.getTime())) {
        console.error("[AUTOSAVE] La date de sauvegarde est invalide :", lastDateSave);
        return false; // Sortie pour éviter des comportements imprévisibles
    }

    const differenceMs = Math.abs(d2 - d1);
    const differenceEnJours = differenceMs / (1000 * 60 * 60 * 24);

    if (devMode === true) {
        console.log("[AUTOSAVE] Comparaison des dates");
        console.log("[AUTOSAVE] Date de dernière sauvegarde :", d1);
        console.log("[AUTOSAVE] Date du jour :", d2);
        console.log("[AUTOSAVE] Fréquence (jours) :", frequency);
        console.log("[AUTOSAVE] Différence en jours :", differenceEnJours);
    }

    return differenceEnJours >= frequency;
}





function eventSaveResult(isAutoSave){
    if (devMode === true) {console.log("[AUTOSAVE] Fin de sauvegarde, actualisation set la date au bon emplacement");};

    if (isAutoSave) {
        // Mise à jour du texte 
        document.getElementById("pSettingLastAutoSaveDate").innerHTML = `Le ${onFormatDateToFr(userSetting.lastAutoSaveDate)} à ${userSetting.lastAutoSaveTime}`;
    }else{
        // Mise à jour du texte
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
                        const transaction = db_old.transaction([storeName], 'readwrite');
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