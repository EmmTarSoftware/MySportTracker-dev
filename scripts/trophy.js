// Variables

// Tableau des trophy
let allTrophyArray = [
    {trophyName:"ACTIVITES-20", imgRef : "./Badges/Badge-20-activite.webp", text : "A accomplit 20 activités."},
    {trophyName:"ABSENT", imgRef : "./Badges/Badge-absent.webp", text : "N'a pratiqué aucune activité depuis 1 mois !"},
    {trophyName:"MUSCU-10", imgRef : "./Badges/Badge-Muscu-10-seance.webp", text : "A pratiqué 10 séances de musculation."},
    {trophyName:"CAP-10", imgRef : "./Badges/Badge-running-10km.webp", text : "A parcouru 10km en une séance de course à pied."},
    {trophyName:"CAP-SEMI", imgRef : "./Badges/Badge-running-semi.webp", text : "A réalisé un semi-marathon"},
    {trophyName:"CAP-MARATHON", imgRef : "./Badges/Badge-marathon.webp", text : "Tout est dit !"}
];







// Reference 
let imgTrophyFullScreenRef,
pTrophyFullScreenTextRef;

function onOpenMenuTrophy(){
    console.log("[TROPHY] Ouverture menu Trophy");


    // Reference les éléments
    imgTrophyFullScreenRef = document.getElementById("imgTrophyFullScreen");
    pTrophyFullScreenTextRef = document.getElementById("pTrophyFullScreenText");

}



// Fonction de recupération d'un trophy dans le tableau

function onSearchTrophyInArray(trophyTarget) {
    return allTrophyArray.find(trophy => trophy.trophyName === trophyTarget);
}





// Affiche en grand la récompense
function onDisplayTrophyFullScreen(trophyRef) {
    console.log("[TROPHY]  demande de visualisation de récompense : " + trophyRef);

    let currentTrophyData = onSearchTrophyInArray(trophyRef);


    console.log(currentTrophyData);

    // set les éléments et affiche
    imgTrophyFullScreenRef.src = currentTrophyData.imgRef;
    pTrophyFullScreenTextRef.innerHTML = currentTrophyData.text;

    document.getElementById("divFullScreenTrophy").classList.add("show");
}


// Masque la récompense qui était en grand plan
function onHiddenFullscreenTrophy() {
    console.log("cache la div de visualisation de récompense");
    document.getElementById("divFullScreenTrophy").classList.remove("show");
}




   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   // Retour depuis Trophy
   function onClickReturnFromTrophy() {

    // Vide les réferences
    imgTrophyFullScreenRef = "";
    pTrophyFullScreenTextRef ="";

   
       // ferme le menu
       onLeaveMenu("Trophy");
   };