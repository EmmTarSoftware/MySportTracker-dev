
function onOpenMenuInfo() {

    // Chargement de la liste des activité pour visualisation
    onLoadingActivityList();
};


// Fonction de chargement de la liste d'activité

function onLoadingActivityList() {
    let ulActivityListParentRef = document.getElementById("ulActivityListParent");

    activityChoiceArray.forEach(activity=>{

        // Création
        let newLi = document.createElement("li");
        newLi.className = "info-list";

        let newActivityName = document.createElement("p");
        newActivityName.innerHTML = activity.displayName;
        newActivityName.className = "info-list";

        let newActivityImg = document.createElement("img");
        newActivityImg.src = activity.imgRef;
        newActivityImg.className = "info-list";



        // Favoris
        let newFavorisImg = document.createElement("img");

        let isFavoris = onSearchActivityInUserFavoris(activity.dataName);

        newFavorisImg.src = isFavoris === true ? "./icons/Icon-Favoris-Sel.png" : "./icons/Icon-Favoris.png";
        newFavorisImg.className = "favoris";




        newFavorisImg.onclick = function (){
            onChangeFavorisStatus(this,activity.dataName); 
        };

        // Insertion
        newLi.appendChild(newActivityImg);
        newLi.appendChild(newActivityName);
        newLi.appendChild(newFavorisImg);

        ulActivityListParentRef.appendChild(newLi);

    });
};



// Retour depuis info
function onClickReturnFromInfo() {
    // Vide la liste :
    document.getElementById("ulActivityListParent").innerHTML = "";

    // ferme le menu
    onLeaveMenu("Info");
};