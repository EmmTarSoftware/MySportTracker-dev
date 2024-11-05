
function onOpenMenuInfo() {

    // Chargement de la liste des activité pour visualisation
    onLoadingActivityList();
};


// Fonction de chargement de la liste d'activité

function onLoadingActivityList() {
    let ulActivityListParentRef = document.getElementById("ulActivityListParent");

    activityArray.forEach(activity=>{

        // Création
        let newLi = document.createElement("li");

        let newActivityName = document.createElement("p");
        newActivityName.innerHTML = activity.displayName;
        newActivityName.className = "info-list";

        let newActivityImg = document.createElement("img");
        newActivityImg.src = activity.imgRef;
        newActivityImg.className = "info-list";

        // Insertion
        newLi.appendChild(newActivityName);
        newLi.appendChild(newActivityImg);

        ulActivityListParentRef.appendChild(newLi);

    });



};
















// Retour depuis info
function onClickReturnFromInfo() {
    // Vide la liste :
    document.getElementById("ulActivityListParent").innerHTML = "";

    // ferme le menu
    onChangeDisplay(["divInfo"],["divMainBtnMenu","divHome"],[],[],[],[]);
};