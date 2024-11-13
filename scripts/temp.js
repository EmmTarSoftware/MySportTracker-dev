
// Insertion des activités dans la liste
let activityListToDisplay = []; // contient les activité trié et filtré à afficher
let maxActivityPerCycle = 2;
let activityListIndexToStart = 0;


function onInsertActivityInList(activityToDisplay) {

    // Stock les activité à afficher dans un tableau
    activityListToDisplay = activityToDisplay;
    activityListIndexToStart = 0;

    console.log("nbre d'activité total à afficher = " + activityListToDisplay.length);
    console.log("Vide la liste des activités");
    divItemListRef.innerHTML = "";

    if (activityToDisplay.length === 0) {
        divItemListRef.innerHTML = "Aucune activité à afficher !";
        return
    }else{
        console.log("Demande d'insertion du premier cycle d'activité dans la liste");
        onInsertMoreActivity();
    };


};

// séquence d'insertion  d'activité dans la liste selon le nombre limite définit
function onInsertMoreActivity() {
    console.log("Lancement d'un cycle d'insertion d'activité.")
    let cycleCount = 0;

    console.log("Index de départ = " + activityListIndexToStart);

    for (let i = activityListIndexToStart; i < activityListToDisplay.length; i++) {

        if (cycleCount >= maxActivityPerCycle) {
            console.log("Max par cycle atteinds = " + maxActivityPerCycle);
            // Creation du bouton More
            onCreateMoreActivityBtn();
            activityListIndexToStart += maxActivityPerCycle;
            console.log("mise a jour du prochain index to start = " + activityListIndexToStart);
            // Arrete la boucle si lorsque le cycle est atteind
            return
        }else{
            onInsertOneActivity(activityListToDisplay[i]);
        };
        cycleCount++;
    };

    
};




// Fonction d'insertion d'une activité dans la liste
function onInsertOneActivity(activity) {

    let activityArrayItem = getActivityArrayRefByDataName(activity.name);


    // La div de l'item
    let newItemContainer = document.createElement("div");
    newItemContainer.className = "item-container";

    newItemContainer.onclick = function () {
        onClickOnActivity(activity.key);
    };


    // La zone de l'image
    let newImageContainer = document.createElement("div");
    newImageContainer.className = "item-image-container";

    let newImage = document.createElement("img");
    newImage.className = "activity";
    newImage.src = activityArrayItem.imgRef;

    newImageContainer.appendChild(newImage);



    // la done des données

    let newDivDataContainer =  document.createElement("div");
    newDivDataContainer.className = "item-data-container";


    // Area 1
    let newDivDataArea1 = document.createElement("div");
    newDivDataArea1.className = "item-data-area1";

    let newItemDistance = document.createElement("p");
    newItemDistance.className = "item-data-distance";
    newItemDistance.innerHTML = activity.distance != "" ? activity.distance + " km": "---";

    let newItemDuration = document.createElement("p");
    newItemDuration.className = "item-data-duration";
    newItemDuration.innerHTML = activity.duration;

    let newItemDate = document.createElement("p");
    newItemDate.className = "item-data-date";
    if (activity.date === dateToday) {
        newItemDate.innerHTML = "Auj.";
    }else if (activity.date === dateYesterday) {
        newItemDate.innerHTML = "Hier";
    }else{
        newItemDate.innerHTML = onFormatDateToFr(activity.date);
    };

    

    newDivDataArea1.appendChild(newItemDistance);
    newDivDataArea1.appendChild(newItemDuration);
    newDivDataArea1.appendChild(newItemDate);

    // Area 2
    let newDivDataArea2 = document.createElement("div");
    newDivDataArea2.className = "item-data-area2";

    let newItemLocation = document.createElement("p");
    newItemLocation.className = "item-data-location";
    newItemLocation.innerHTML = activity.location != "" ? activity.location : "---";

    newDivDataArea2.appendChild(newItemLocation);
    

    // Insertion totale
    newDivDataContainer.appendChild(newDivDataArea1);
    newDivDataContainer.appendChild(newDivDataArea2);

    newItemContainer.appendChild(newImageContainer);
    newItemContainer.appendChild(newDivDataContainer);

    divItemListRef.appendChild(newItemContainer);
};




// Fonction pour le bouton MoreActivity

function onCreateMoreActivityBtn() {
    let newBtn = document.createElement("button");
    newBtn.innerHTML = "MORE";
    newBtn.onclick = function (){
        onInsertMoreActivity();
    };


    divItemListRef.appendChild(newBtn);

};
