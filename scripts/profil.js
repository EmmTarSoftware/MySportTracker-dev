
// Variabilisation
let userInfo = {
    name :"",
    gender : "",
    birthDate : "",
    size :"",
    weight :""
};

// Référencement
let inputProfilUserNameRef,
selectorProfilUserGenderRef,
inputProfilUserBirthDateRef,
inputProfilUserSizeRef,
inputProfilUserWeightRef;



// Ouverture du menu profil
function onOpenMenuProfil() {
    // Lance le référencement des items
    onReferenceItemsProfils();

    // set les éléments du profils
    onSetProfilItems();
};



// Fonction de référencement des éléments du menu profil
function onReferenceItemsProfils() {
    inputProfilUserNameRef = document.getElementById("inputProfilUserName");
    selectorProfilUserGenderRef = document.getElementById("selectorProfilGender");
    inputProfilUserBirthDateRef = document.getElementById("inputProfilUserBirthDate");
    inputProfilUserSizeRef = document.getElementById("inputProfilUserSize");
    inputProfilUserWeightRef = document.getElementById("inputProfilUserWeight");

    console.log(" [ PROFIL ] Référence les éléments du profils.")
};




function onSetProfilItems() {
    console.log("[PROFIL] set les éléments du menu profils");
    inputProfilUserNameRef.value = userInfo.name;
    selectorProfilUserGenderRef.value = userInfo.gender;
    inputProfilUserBirthDateRef.value = userInfo.birthDate;
    inputProfilUserSizeRef.value = userInfo.size;
    inputProfilUserWeightRef.value = userInfo.weight;

};







// Clique sur save profil
function onClickSaveProfil() {
    // Lancement de sauvegarde du nouveau profil uniquement si modifié
    if (userInfo.name != inputProfilUserNameRef.value || userInfo.gender != selectorProfilUserGenderRef.value || userInfo.birthDate != inputProfilUserBirthDateRef.value || userInfo.size != inputProfilUserSizeRef.value || userInfo.weight != inputProfilUserWeightRef.value) {
        
        console.log("[PROFIL] informations de profils différents : Lancement de l'enregistrement");
        onSaveUserInfo();
    }else{
        console.log("[PROFIL] Aucune modification de profil nécessaire !");
        onLeaveMenu("Profil");
    }
};





// Fonction de sauvegarde du profil dans la bdd
function onSaveUserInfo() {

    // Met tous les éléments des inputs dans la variable userInfo
    userInfo.name = inputProfilUserNameRef.value;
    userInfo.gender = selectorProfilUserGenderRef.value;
    userInfo.birthDate = inputProfilUserBirthDateRef.value;
    userInfo.size = inputProfilUserSizeRef.value;
    userInfo.weight = inputProfilUserWeightRef.value;



    // Sauvegarde dans la base
    console.log( "[ PROFIL ] sauvegarde des users info dans les cookies.");
    onInsertProfilModificationInDB(userInfo);
};





// Creation du profils par défaut
function onCreateDefaultProfilInBase(profilToInsert) {
        let transaction = db.transaction(profilStoreName,"readwrite");
        let store = transaction.objectStore(profilStoreName);
    
        let insertRequest = store.add(profilToInsert);
    
        insertRequest.onsuccess = function () {
            console.log(" [ DATABASE PROFIL] Un nouveau profil a été ajouté à la base");
            // evenement de notification
    
            
        };
    
        insertRequest.onerror = function(event){
            console.log("[ DATABASE PROFIL] Error d'insertion du profil");
            let errorMsg = event.target.error.toString();
            console.log(errorMsg);
            
        };
    
        transaction.oncomplete = function(){
            console.log("[ DATABASE PROFIL] nouveau profil : transaction insertData complete");
    
        };
};    





// Fonction de modification du profil dans la base
function onInsertProfilModificationInDB(e) {
    console.log("fonction d'insertion de la donnée modifié");

    let transaction = db.transaction(profilStoreName,"readwrite");
    let store = transaction.objectStore(profilStoreName);
    let modifyRequest = store.getAll(IDBKeyRange.only(1));

    

    modifyRequest.onsuccess = function () {
        console.log("modifyRequest = success");

        let modifiedData = modifyRequest.result[0];

        modifiedData.name = e.name;
        modifiedData.gender = e.gender;
        modifiedData.birthDate = e.birthDate;
        modifiedData.size = e.size;
        modifiedData.weight = e.weight;

        let insertModifiedData = store.put(modifiedData);

        insertModifiedData.onsuccess = function (){
            console.log("[ DATABASE PROFIL] insert ModifiedData = success");

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
        console.log("[ PROFIL ] Mise à jours du nom de l'utilisateur dans l'application.");
        document.getElementById("userName").innerHTML = userInfo.name;

        // Popup notification
        onShowNotifyPopup(notifyTextArray.saveprofil);
        // ferme le menu
        onLeaveMenu("Profil");
    };
};





function onExtractProfilFromDB(){
    console.log("[ DATABASE PROFIL ] Récupère les éléments dans la base");

    let transaction = db.transaction([profilStoreName]);//readonly
    let objectStoreTask = transaction.objectStore(profilStoreName);

    // Rechercher un élément où l'index 'userName' est égal à '1'
    let requestTask = objectStoreTask.get(1);


    // Traitement de la requête
    requestTask.onsuccess = function(event) {
        if (requestTask.result) {
            console.log('[ DATABASE PROFIL ] Élément trouvé : ', requestTask.result);

            onSetUserInfoFromOpeningAPP(requestTask.result);

        } else {
            console.log('[ DATABASE PROFIL ] Aucun élément trouvé pour le userName');
        }
    };

    requestTask.onerror = function(event) {
        console.error('Erreur lors de la récupération de l\'élément', event.target.error);
    };

};


// Remplit les élements de userInfo lors de l'ouverture de l'application
function onSetUserInfoFromOpeningAPP(data) {

    console.log("[PROFIL] remplit les userInfo éléments");

    // Remplit la variable
    userInfo.name = data.name;
    userInfo.gender = data.gender;
    userInfo.birthDate = data.birthDate;
    userInfo.size = data.size;
    userInfo.weight = data.weight;

    console.log("[PROFIL] Valeur de userInfo = ");

    console.log(userInfo);

    // set également le html du nom de l'utilisateur
    console.log("[ PROFIL ] Mise à jours du nom de l'utilisateur dans l'application.");
    document.getElementById("userName").innerHTML = userInfo.name;

};





// quitte le menu profil
function onClickReturnFromProfil() {
    // ferme le menu
    onLeaveMenu("Profil");
};