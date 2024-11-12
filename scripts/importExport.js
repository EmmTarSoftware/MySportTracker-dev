// La date du jour pour l'export
let exportDate;
// Sauvegarde de la base de donnée


function exportData() {
    // Set la date du jour
    exportDate = onFindDateTodayUS();


    console.log("Demande d'export data");
    var transaction = db.transaction([activityStoreName], 'readonly');
    var store = transaction.objectStore(activityStoreName);

    var exportRequest = store.getAll();

    exportRequest.onsuccess = function() {
        var data = exportRequest.result;
        downloadJSON(data, `MonSuivitSportif_${exportDate}_exported_Activity.json`);
    };

    exportRequest.onerror = function(error) {
        console.log('Erreur lors de l\'export des données : ', error);
    };

    transaction.oncomplete = function(){
        
    };



};



//Fonction de téléchargement
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



 // Fonction d'importation depuis JSON
 function importTask(inputRef,pResultRef) {
    const fileInput = document.getElementById(inputRef,activityStoreName);
    let textResultRef = document.getElementById(pResultRef);



    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);

                const transaction = db.transaction([activityStoreName], 'readwrite');
                const objectStore = transaction.objectStore(activityStoreName);

                // Supprimer les anciennes données
                const clearRequest = objectStore.clear();

                clearRequest.onsuccess = function () {
                    // Ajouter les nouvelles données
                    jsonData.forEach(function (item) {
                        objectStore.add(item);
                    });

                    transaction.oncomplete = function () {
                        console.log('Imported JSON to IndexedDB successfully.');                        };
                        textResultRef.innerHTML =  "Import Réussit ! Veuillez relancer l'application.";
                    transaction.onerror = function (error) {
                        console.error('Error adding items to IndexedDB:', error);
                        textResultRef.innerHTML =  "Erreur transaction import";
                    };
                };
               
            } catch (error) {
                console.error('Error parsing JSON:', error);
                textResultRef.innerHTML =  "Erreur import";
            };
        };

        reader.readAsText(selectedFile);
    } else {
        console.error('No file selected.');
        textResultRef.innerHTML =  "Aucun fichier sélectionné !";
    };
};