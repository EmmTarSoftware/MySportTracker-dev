
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


// Les noms des cookies
let cookieUserName_KeyName = "MonSuivitSportif-userName",
cookieUserGenger_KeyName = "MonSuivitSportif-userGender",
cookieUserBirthDate_KeyName = "MonSuivitSportif-userBirthDate",
cookieUserSize_KeyName = "MonSuivitSportif-userSize",
cookieUserWeight_KeyName = "MonSuivitSportif-userWeight";








// Vérification des cookies au démarrage de l'application
// Création si besoin

function onCheckCookieOnstartAPP() {
    console.log(" [ PROFIL ] Vérification de l'existance des cookies du profil");

    if (localStorage.getItem(cookieUserName_KeyName) === null) {
        localStorage.setItem(cookieUserName_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserName_KeyName);
    };

    if (localStorage.getItem(cookieUserGenger_KeyName) === null) {
        localStorage.setItem(cookieUserGenger_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserGenger_KeyName);
    };

    if (localStorage.getItem(cookieUserBirthDate_KeyName) === null) {
        localStorage.setItem(cookieUserBirthDate_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserBirthDate_KeyName);
    };

    if (localStorage.getItem(cookieUserSize_KeyName) === null) {
        localStorage.setItem(cookieUserSize_KeyName,"");
        console.log(" [ PROFIL ] Creation du cookies : " + cookieUserSize_KeyName);
    };

    if (localStorage.getItem(cookieUserWeight_KeyName) === null) { 
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
        birthDate : localStorage.getItem(cookieUserBirthDate_KeyName),
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
    inputProfilUserBirthDateRef.value = localStorage.getItem(cookieUserBirthDate_KeyName);
    inputProfilUserSizeRef.value = localStorage.getItem(cookieUserSize_KeyName);
    inputProfilUserWeightRef.value = localStorage.getItem(cookieUserWeight_KeyName);

    console.log(" [ PROFIL ] set les éléments du profils.");
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






// Fonction de sauvegarde du profil dans les cookies
function onSaveUserInfo() {

    localStorage.setItem(cookieUserName_KeyName,inputProfilUserNameRef.value);
    localStorage.setItem(cookieUserGenger_KeyName,selectorProfilUserGenderRef.value);
    localStorage.setItem(cookieUserBirthDate_KeyName,inputProfilUserBirthDateRef.value);
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