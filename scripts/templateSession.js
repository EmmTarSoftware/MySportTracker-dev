//contient la liste des noms et id des modèles de session
let templateSessionsNameList = {
    "id1":{name:"saucisse"},
    "id2":{name:"tomate"}
},
templateSessionNameListSortedKey = [];//liste des clé trié par ordre alphabétique







// ------------------------ Fonction générales ----------------------------------------------------





// Insertion nouveau activity
async function onInsertNewTemplateSessionInDB(templateSessionToInsert) {
    try {
        // Obtenir le prochain ID
        const nextId = await getNextIdNumber(templateSessionCountIDStoreName);

        // Créer l'objet avec le nouvel ID
        const newTemplateSession = {
            _id: `${templateSessionStoreName}_${nextId}`,
            type: templateSessionStoreName,
            ...templateSessionToInsert
        };

        // Insérer dans la base
        await db.put(newTemplateSession);

        if (devMode === true ) {console.log("[DATABASE] [ACTIVITY] Activité insérée :", newTemplateSession);};

        return newTemplateSession;
    } catch (err) {
        console.error("[DATABASE] [ACTIVITY] Erreur lors de l'insertion de l'activité :", err);
    }
}



async function onLoadTemplateSessionNameFromDB() {
    templateSessionsNameList = {}; // Initialisation en objet

    try {
        const result = await db.allDocs({ include_docs: true }); // Récupère tous les documents

        // Filtrer et extraire uniquement les champs nécessaires
        result.rows.forEach(row =>{
            if (row.doc.type === templateSessionStoreName){
                templateSessionsNameList[row.doc._id] = { name: row.doc.sessionName };
            }
        });

        if (devMode === true) {
            console.log("[DATABASE] [TEMPLATE] Templates chargés :", templateSessionsNameList);
        }
    } catch (err) {
        console.error("[DATABASE] [TEMPLATE] Erreur lors du chargement:", err);
    }
}



// class d'une div de modèle de session à inserer dans la liste
class TemplateSessionItemList {
    constructor(id,sessionName,parentRef){
        this.id = id;
        this.sessionName = sessionName;
        this.parentRef = parentRef;

        this.element = document.createElement("div");
        this.element.classList.add("item-container");
        // Utilisation d'une fonction fléchée pour conserver le bon "this"
        this.element.onclick = () => {
            alert(this.id);
            // onModifyTemplateSession(this.id);
        };

        this.render();
    }


    render(){
        this.element.innerHTML = `
            <span>${this.sessionName}</span>
        `;

        //insertion dans le parent
        this.parentRef.appendChild(this.element);
    };
}


// ------------------------ FIN Fonction générales ----------------------------------------------------






async function onOpenMenuTemplateSession() {
    console.log("ouverture de menu template session");


    // Récupère la liste des modèle de session depuis la base
    await onLoadTemplateSessionNameFromDB();


    // Récupère les clé triées
    templateSessionNameListSortedKey = Object.keys(templateSessionsNameList);
    templateSessionNameListSortedKey.sort();


    // Affiche la liste des modèles de sessions
    onSetTemplateSessionNameList();
}





// actualise la liste des modèles de session
function onSetTemplateSessionNameList() {
    
    // Récupère le parent et le vide
    let parentRef = document.getElementById("divTemplateSessionListMenu");
    parentRef.innerHTML = "";

    //Affichage si aucun modèle de session
    if (templateSessionNameListSortedKey.length === 0 ) {
       parentRef.innerHTML = "Aucun modèle à afficher !";
       return
    }

    // Pour chaque ligne dans le tableau
    templateSessionNameListSortedKey.forEach(key=>{
        // Crée une div
        new TemplateSessionItemList(key,templateSessionsNameList[key].name,parentRef);
    });

}





// Quitte le menu principal
function onClickReturnFromMenuTemplateSession() {

    //vide le tableau
    document.getElementById("bodyTableGenerateSessionEditor").innerHTML = "";

    onLeaveMenu("MenuTemplateSession");
}









// ----------------------------------------- editeur de modèle de session-------------------------------------------------

// lance d'éditeur de sesion

function onClickBtnCreateTemplateSession(){

    // Demande de création du tableau vide
    onCreateTemplateSessionTableLine();
};







// fonction de génération des lignes du tableau
function onCreateTemplateSessionTableLine() {
    
    // Reférence le parent
    let parentRef = document.getElementById("bodyTableGenerateSessionEditor");

    // Reset le contenu du parent
    parentRef.innerHTML = "";

    // Génère le tableau
    for (let i = 0; i < maxCounter; i++) {
        new TableLineSession(parentRef,i); 
    }
}




async function onClickSaveFromTemplateSessionEditor() {

    // Masque le popup

    // Récupère les éléments de la liste
    let newCounterList = onGetTableTemplateSessionItem();

    // Récupère le nom du modele
    let templateSessionName = document.getElementById("inputTemplateSessionName").value;

    let templateSessionTosave = {
        sessionName: templateSessionName,
        counterList : newCounterList
    }
    console.log(templateSessionTosave);

    // Sauvegarde
    await onInsertNewTemplateSessionInDB(templateSessionTosave);


    // actualise la liste des templates

    // Notification
}










// Fonction pour récupérer le contenu du tableau de création de modele de session
function onGetTableTemplateSessionItem() {
    let counterList = [];

    for (let i = 0; i < maxCounter; i++) {

        // Reférence les éléments
        inputName = document.getElementById(`inputGenSessionNom_${i}`);
        inputSerie = document.getElementById(`inputGenSessionSerie_${i}`);
        inputRep = document.getElementById(`inputGenSessionRep_${i}`);
        selectColor = document.getElementById(`selectGenSessionColor_${i}`);

        // Si inputName remplit
        if (inputName.value != "") {

            // récupère les éléments de la ligne 
            counterList.push( {
                counterName: inputName.value, 
                serieTarget: parseInt(inputSerie.value) || 0,
                repIncrement: parseInt(inputRep.value) || 0,
                color : selectColor.value
            })
        } 
    }

    return counterList;
}

















// Quitte l'éditeur de modèle de session
function onClickReturnFromTemplateSessionEditor() {

    //vide le tableau
    document.getElementById("bodyTableGenerateSessionEditor").innerHTML = "";

    onLeaveMenu("TemplateSessionEditor");
}


