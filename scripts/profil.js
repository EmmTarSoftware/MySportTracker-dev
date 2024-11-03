
// Variabilisation
let userInfo = {
    name :"",
    gender : "",
    age : "",
    size :"",
    weight :""
};

// Référencement
let inputProfilUserNameRef,
selectorProfilUserGenderRef,
inputProfilUserAgeRef,
inputProfilUserSizeRef,
inputProfilUserWeightRef;


// Les noms des cookies
let cookieUserName_KeyName = "MonSuivitSportif-userName",
cookieUserGenger_KeyName = "MonSuivitSportif-userGender",
cookieUserAge_KeyName = "MonSuivitSportif-userAge",
cookieUserSize_KeyName = "MonSuivitSportif-userSize",
cookieUserWeight_KeyName = "MonSuivitSportif-userWeight";








// Vérification des cookies au démarrage de l'application
// Création si besoin

function onCheckCookieOnstartAPP() {
    console.log(" [ PROFIL ] Vérification de l'existance des cookies du profil");
    if (!localStorage.getItem(cookieUserName_KeyName)) {
        localStorage.setItem(cookieUserName_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserName_KeyName);
    };

    if (!localStorage.getItem(cookieUserGenger_KeyName)) {
        localStorage.setItem(cookieUserGenger_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserGenger_KeyName);
    };

    if (!localStorage.getItem(cookieUserAge_KeyName)) {
        localStorage.setItem(cookieUserAge_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserAge_KeyName);
    };

    if (!localStorage.getItem(cookieUserSize_KeyName)) {
        localStorage.setItem(cookieUserSize_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserSize_KeyName);
    };

    if (!localStorage.getItem(cookieUserWeight_KeyName)) { 
        localStorage.setItem(cookieUserWeight_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserWeight_KeyName);
    };
};

onCheckCookieOnstartAPP();



// Fonction de mise à jour du profils
function onUpdateUserInfo() {
    
    userInfo = {
        name : localStorage.getItem(cookieUserName_KeyName),
        gender : localStorage.getItem(cookieUserGenger_KeyName),
        age : localStorage.getItem(cookieUserAge_KeyName),
        size : localStorage.getItem(cookieUserSize_KeyName),
        weight : localStorage.getItem(cookieUserWeight_KeyName)   
    };

    console.log( "[ PROFIL ] Mise à jours de la data userInfo.");
    console.log(userInfo);


    console.log("[ PROFIL ] Mise à jours du nom de l'utilisateur dans l'application.");
    document.getElementById("userName").innerHTML = userInfo.name;
};

onUpdateUserInfo();

// Ouverture du menu profil

function onOpenMenuProfil() {
    // Lance le référencement des items
    onReferenceItemsProfils();

    // set les éléments du profils
    onSetProfilItems();
};



// fonction pour set les éléments du menu profil : 
function onSetProfilItems() {
    inputProfilUserNameRef.value = localStorage.getItem(cookieUserName_KeyName);
    selectorProfilUserGenderRef.value = localStorage.getItem(cookieUserGenger_KeyName);
    inputProfilUserAgeRef.value = localStorage.getItem(cookieUserAge_KeyName);
    inputProfilUserSizeRef.value = localStorage.getItem(cookieUserSize_KeyName);
    inputProfilUserWeightRef.value = localStorage.getItem(cookieUserWeight_KeyName);

    console.log(" [ PROFIL ] set les éléments du profils.");
};


// Fonction de référencement des éléments du menu profil
function onReferenceItemsProfils() {
    inputProfilUserNameRef = document.getElementById("inputProfilUserName");
    selectorProfilUserGenderRef = document.getElementById("selectorProfilGender");
    inputProfilUserAgeRef = document.getElementById("inputProfilUserAge");
    inputProfilUserSizeRef = document.getElementById("inputProfilUserSize");
    inputProfilUserWeightRef = document.getElementById("inputProfilUserWeight");

    console.log(" [ PROFIL ] Référence les éléments du profils.")
};






// Fonction de sauvegarde du profil dans les cookies
function onSaveUserInfo() {

    localStorage.setItem(cookieUserName_KeyName,inputProfilUserNameRef.value);
    localStorage.setItem(cookieUserGenger_KeyName,selectorProfilUserGenderRef.value);
    localStorage.setItem(cookieUserAge_KeyName,inputProfilUserAgeRef.value);
    localStorage.setItem(cookieUserSize_KeyName,inputProfilUserSizeRef.value);
    localStorage.setItem(cookieUserWeight_KeyName,inputProfilUserWeightRef.value);

    console.log( "[ PROFIL ] sauvegarde des users info dans les cookies.");

    // Met à jour la data userInfo
    onUpdateUserInfo();
};






// Clique sur save profil

function onClickSaveProfil() {
    // sauvegarde les données
    onSaveUserInfo();
    // ferme le menu
    onChangeDisplay(["divProfil"],["divMainBtnMenu","divHome"],[],[]);
};

function onClickReturnFromProfil() {
    // ferme le menu
    onChangeDisplay(["divProfil"],["divMainBtnMenu","divHome"],[],[]);
};