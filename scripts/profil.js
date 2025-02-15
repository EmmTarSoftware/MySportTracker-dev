
// Variabilisation
let userInfo = {
    pseudo :"",
    customNotes :""
};

// Référencement
let inputProfilUserPseudoRef,
textareaCustomNotesRef;


// Ouverture du menu profil
function onOpenMenuProfil() {
    // Lance le référencement des items
    onReferenceItemsProfils();

    // set les éléments du profils
    onSetProfilItems();
};



// Fonction de référencement des éléments du menu profil
function onReferenceItemsProfils() {
    inputProfilUserPseudoRef = document.getElementById("inputProfilUserPseudo");
    textareaCustomNotesRef = document.getElementById("textareaCustomNotes");
    if (devMode === true){console.log(" [ PROFIL ] Référence les éléments du profils.");};
};




function onSetProfilItems() {
    if (devMode === true){console.log("[PROFIL] set les éléments du menu profils");};
    inputProfilUserPseudoRef.value = userInfo.pseudo;
    textareaCustomNotesRef.value = userInfo.customNotes;

    console.log("userInfo custom note : " + userInfo.customNotes);

};







// Clique sur save profil
function onClickSaveProfil() {

    // Lancement de sauvegarde du nouveau profil uniquement si modifié
   // Création d'une liste de champs à comparer
    const fieldsToCompare = [
        { oldValue: userInfo.pseudo, newValue: inputProfilUserPseudoRef.value },
        { oldValue: userInfo.customNotes, newValue: textareaCustomNotesRef.value}
    ];

    // Vérification si une différence est présente
    // some s'arrete automatiquement si il y a une différence
    const updateDataRequiered = fieldsToCompare.some(field => field.oldValue != field.newValue);

    if (updateDataRequiered) {
        if (devMode) console.log("[PROFIL] Informations de profils différentes : Lancement de l'enregistrement");
        onSaveUserInfo();
    } else {
        if (devMode) console.log("[PROFIL] Aucune modification de profil nécessaire !");
        onLeaveMenu("Profil");
    }
};





// Fonction de sauvegarde du profil dans la bdd
function onSaveUserInfo() {

    // Met tous les éléments des inputs dans la variable userInfo
    userInfo.pseudo = inputProfilUserPseudoRef.value;
    userInfo.customNotes = textareaCustomNotesRef.value;

    // Sauvegarde dans la base
    if (devMode === true){console.log( "[ PROFIL ] sauvegarde des users info dans les cookies.");};
    onInsertProfilModificationInDB(userInfo);
};





// Creation du profils par défaut
function onCreateDefaultProfilInBase(profilToInsert) {
        let transaction = db_old.transaction(profilStoreName,"readwrite");
        let store = transaction.objectStore(profilStoreName);
    
        let insertRequest = store.add(profilToInsert);
    
        insertRequest.onsuccess = function () {
            if (devMode === true){console.log(" [ DATABASE PROFIL] Un nouveau profil a été ajouté à la base");};
            // evenement de notification
    
            
        };
    
        insertRequest.onerror = function(event){
            console.log("[ DATABASE PROFIL] Error d'insertion du profil");
            let errorMsg = event.target.error.toString();
            console.log(errorMsg);
            
        };
    
        transaction.oncomplete = function(){
            if (devMode === true){console.log("[ DATABASE PROFIL] nouveau profil : transaction insertData complete");};
    
        };
};    





// Fonction de modification du profil dans la base
function onInsertProfilModificationInDB(e) {
    if (devMode === true){console.log("fonction d'insertion de la donnée modifié");};

    let transaction = db_old.transaction(profilStoreName,"readwrite");
    let store = transaction.objectStore(profilStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(1));

    

    modifyRequest.onsuccess = function () {
        if (devMode === true){console.log("modifyRequest = success");};

        let modifiedData = modifyRequest.result[0];

        modifiedData.pseudo = e.pseudo;
        modifiedData.customNotes = e.customNotes;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            if (devMode === true){console.log("[ DATABASE PROFIL] insert ModifiedData = success");};

        };

        insertModifiedData.onerror = function (){
            console.log("[ DATABASE PROFIL] insert ModifiedData = error",insertModifiedData.error); 
        };
    };

    modifyRequest.onerror = function(){
        console.log("[ DATABASE PROFIL] ModifyRequest = error");
    };

    transaction.oncomplete = function(){

        // Met a jour l'affichage de nom de l'utilisateur
        if (devMode === true){console.log("[ PROFIL ] Mise à jours du pseudo de l'utilisateur dans l'application.");};
        document.getElementById("userPseudo").innerHTML = userInfo.pseudo;

        // Popup notification
        onShowNotifyPopup(notifyTextArray.saveprofil);
        // ferme le menu
        onLeaveMenu("Profil");
    };
};





function onExtractProfilFromDB(){
    if (devMode === true){console.log("[ DATABASE PROFIL ] Récupère les éléments dans la base");};

    let transaction = db_old.transaction([profilStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(profilStoreName);

    // Rechercher un élément où l'index 'userName' est égal à '1'
    let requestTask = objectStoreTask.get(1);


    // Traitement de la requête
    requestTask.onsuccess = function(event) {
        if (requestTask.result) {
            if (devMode === true){console.log('[ DATABASE PROFIL ] Élément trouvé : ', requestTask.result);};

            onSetUserInfoFromOpeningAPP(requestTask.result);

        } else {
            if (devMode === true){console.log('[ DATABASE PROFIL ] Aucun élément trouvé pour le profil');};
        }
    };

    requestTask.onerror = function(event) {
        console.error('Erreur lors de la récupération de l\'élément', event.target.error);
    };

};


// Remplit les élements de userInfo lors de l'ouverture de l'application
function onSetUserInfoFromOpeningAPP(data) {

    if (devMode === true){console.log("[PROFIL] remplit les userInfo éléments");};

    // Remplit la variable
    userInfo.pseudo = data.pseudo;
    userInfo.customNotes = data.customNotes;


    if (devMode === true){
        console.log("[PROFIL] Valeur de userInfo = ");
        console.log(userInfo);

        console.log("[ PROFIL ] Mise à jours du pseudo de l'utilisateur dans l'application.");
    };
    // set également le html du nom de l'utilisateur
    document.getElementById("userPseudo").innerHTML = userInfo.pseudo;

};





// quitte le menu profil
function onClickReturnFromProfil() {
    // ferme le menu
    onLeaveMenu("Profil");
};