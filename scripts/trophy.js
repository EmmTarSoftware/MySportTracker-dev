// Variables

// Tableau des trophy
const allTrophyArray = [
    {trophyName:"ACTIVITES-20", imgRef : "./Badges/Badge-20-activite.webp", text : "A accomplit 20 activités."},
    {trophyName:"ABSENT", imgRef : "./Badges/Badge-absent.webp", text : "Aucune activité depuis plus d'un mois !"},
    {trophyName:"MUSCU-10", imgRef : "./Badges/Badge-Muscu-10-seance.webp", text : "A pratiqué 10 séances de musculation."},
    {trophyName:"CAP-10", imgRef : "./Badges/Badge-running-10km.webp", text : "A parcouru 10km en une séance de course à pied."},
    {trophyName:"CAP-SEMI", imgRef : "./Badges/Badge-running-semi.webp", text : "A réalisé un semi-marathon."},
    {trophyName:"CAP-MARATHON", imgRef : "./Badges/Badge-marathon.webp", text : "Ça c'est fait !"},
    {trophyName:"1-AN", imgRef : "./Badges/Badge-1-an.webp", text : "Anniversaire de sportif !"},
    {trophyName:"TRIATHLON", imgRef : "./Badges/Badge-triathlon.webp", text : "Jamais deux sans trois !"}
];




// Simulation userTrophyArray

let userTrophyArray = [
    "ABSENT","ACTIVITES-20","MUSCU-10","1-AN","CAP-10","CAP-SEMI","CAP-MARATHON","TRIATHLON"
];





// Reference 
let imgTrophyFullScreenRef,
pTrophyFullScreenTextRef,
divTrophyListRef;





function onOpenMenuTrophy(){
    console.log("[TROPHY] Ouverture menu Trophy");

    // Reference les éléments
    imgTrophyFullScreenRef = document.getElementById("imgTrophyFullScreen");
    pTrophyFullScreenTextRef = document.getElementById("pTrophyFullScreenText");
    divTrophyListRef = document.getElementById("divTrophyList");


    // Prend les récompenses de l'utilisateur pour les afficher dans la liste
    onLoadUserTrophyList();
    


};



// Creation des récompenses de l'user dans la liste
function onLoadUserTrophyList() {

    divTrophyListRef.innerHTML = "";

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





// -----AFFICHAGE PLEIN ECRAN VISUALISATION-----






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
    pTrophyFullScreenTextRef.innerHTML = currentTrophyData.text;

    document.getElementById("divFullScreenTrophy").classList.add("show");
};


// Masque la récompense qui était en grand plan
function onHiddenFullscreenTrophy() {
    console.log("cache la div de visualisation de récompense");
    document.getElementById("divFullScreenTrophy").classList.remove("show");
};




   
   
   
   
   
   
   
   
   
   
//    Reset le menu des récompenses

function onResetTrophyMenu() {
    imgTrophyFullScreenRef= "";
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