// Variables

// Tableau des trophy
const allTrophyArray = [
    {trophyName:"ACTIVITES-20", imgRef : "./Badges/Badge-20-activite.webp", text : "La 20 ieme",description : "A Pratiqué sa 20ieme activités"},
    {trophyName:"ABSENT", imgRef : "./Badges/Badge-absent.webp", text : "Aux abonnées absents !",description : "N'a pratiqué aucune activité pendant plus d'un mois."},
    {trophyName:"MUSCU-10", imgRef : "./Badges/Badge-Muscu-10-seance.webp", text : "Musclor.",description : "A pratiqué 10 séances de musculation."},
    {trophyName:"CAP-10", imgRef : "./Badges/Badge-running-10km.webp", text : "Runner",description : "A parcouru 10km en une séance de course à pied."},
    {trophyName:"CAP-SEMI", imgRef : "./Badges/Badge-running-semi.webp", text : "SEMI",description : "A parcouru entre 21 et 22km en une session de course à pied"},
    {trophyName:"CAP-MARATHON", imgRef : "./Badges/Badge-marathon.webp", text : "MARATHONIEN",description : "A parcouru entre 42 et 43km en une session de course à pied"},
    {trophyName:"1-AN", imgRef : "./Badges/Badge-1-an.webp", text : "Anniversaire de sportif !",description : "Ta première activité remonte à plus d'un an maintenant."},
    {trophyName:"TRIATHLON", imgRef : "./Badges/Badge-triathlon.webp", text : "Jamais deux sans trois !",description : "A pratiqué un triathlon."},
    {trophyName:"FRACTIONNE", imgRef : "./Badges/Badge-fraction-1.webp", text : "T'aimes les maths ?",description : "A Pratiqué une session de fractionné."},
    {trophyName:"VELO-TOUR-FRANCE", imgRef : "./Badges/Badge-VELO-F.webp", text : "Le Tour de France",description : "A cumulé plus de 3400 km à vélo."}

];




// Simulation userTrophyArray

let userTrophyArray = [
    "ABSENT","ACTIVITES-20","FRACTIONNE","MUSCU-10","1-AN","CAP-10","CAP-SEMI","CAP-MARATHON","TRIATHLON","VELO-TOUR-FRANCE"
];





// Reference 
let imgTrophyFullScreenRef,
pTrophyFullScreenTitleRef,
pTrophyFullScreenTextRef,
divTrophyListRef;







// ----------------------------------------- Ouverture menu récompense ------------------------------







function onOpenMenuTrophy(){
    console.log("[TROPHY] Ouverture menu Trophy");

    // Reference les éléments
    imgTrophyFullScreenRef = document.getElementById("imgTrophyFullScreen");
    pTrophyFullScreenTitleRef = document.getElementById("pTrophyFullScreenTitle");
    pTrophyFullScreenTextRef = document.getElementById("pTrophyFullScreenText");
    divTrophyListRef = document.getElementById("divTrophyList");


    // Prend les récompenses de l'utilisateur pour les afficher dans la liste
    onLoadUserTrophyList();
    


};



// Creation des récompenses de l'user dans la liste
function onLoadUserTrophyList() {

    divTrophyListRef.innerHTML = "";


    if (userTrophyArray.length === 0) {
        divTrophyListRef.innerHTML = "Poursuit tes efforts pour obtenir des récompenses ! 🥇 ";
        return
    }



    console.log("[TROPHY] Création de la liste des récompenses de l'utilsiateur");
    console.log(userTrophyArray);

    userTrophyArray.forEach(trophy=>{

        // Recupère les éléments dans le tableau de référence
        let trophyElement = onSearchTrophyInArray(trophy);


        // Création des images
        let newImg = document.createElement("img");
        newImg.classList = "trophyList";
        newImg.src = trophyElement.imgRef;
        newImg.onclick = function (){
            onDisplayTrophyFullScreen(trophyElement.trophyName);
        };

        // Insertion
        divTrophyListRef.appendChild(newImg);


    });
};





// ---------------------------------------- VISUALISATION   GROS PLAN    --------------------------------






// Fonction de recupération d'un trophy dans le tableau
function onSearchTrophyInArray(trophyTarget) {
    return allTrophyArray.find(trophy => trophy.trophyName === trophyTarget);
};


// Affiche en grand la récompense
function onDisplayTrophyFullScreen(trophyRef) {
    console.log("[TROPHY]  demande de visualisation de récompense : " + trophyRef);

    let currentTrophyData = onSearchTrophyInArray(trophyRef);


    console.log(currentTrophyData);

    // set les éléments et affiche
    imgTrophyFullScreenRef.src = currentTrophyData.imgRef;
    pTrophyFullScreenTitleRef.innerHTML = currentTrophyData.text;
    pTrophyFullScreenTextRef.innerHTML = currentTrophyData.description;

    document.getElementById("divFullScreenTrophy").classList.add("show");
};


// Masque la récompense qui était en grand plan
function onHiddenFullscreenTrophy() {
    console.log("cache la div de visualisation de récompense");
    document.getElementById("divFullScreenTrophy").classList.remove("show");
};










// ---------------------------------    OBTENTION-------------------------------------






function name(params) {
    

    // récupérer tous les éléments concernant le control


    let activityItemTarget = allUserActivityArray.filter((activity)=> activity.dataName)

}















// fonction de calcul d'une valeur fixe
function onCalculTrophyFixeValue(userValue, valueTarget){
    return userValue === valueTarget;
};


function onCalculTrophyRange(userValue, bottomValue, topValue){
    return userValue >= bottomValue && userValue < topValue;
};

















   
   
   
   
   
   
   
//    -----------------------------     QUITTE MENU       ----------------------------------------------





   
//    Reset le menu des récompenses

function onResetTrophyMenu() {
    imgTrophyFullScreenRef= "";
    pTrophyFullScreenTitleRef = "";
    pTrophyFullScreenTextRef = "";
    divTrophyListRef = "";

    divTrophyListRef.innerHTML = "";
}
   
   
   
   
   // Retour depuis Trophy
function onClickReturnFromTrophy() {

    onResetTrophyMenu();
   
    // ferme le menu
    onLeaveMenu("Trophy");
}