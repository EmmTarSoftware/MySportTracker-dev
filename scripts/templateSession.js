//contient la liste des noms et id des modèles de session
let templateSessionsNameList = {
    "id1":{name:"saucisse"},
    "id2":{name:"tomate"}
},
maxTemplateSession = 20,
templateSessionEditorMode = "", // le mode d'ouverture de l'éditeur (creation,modification)
currentTemplateSessionID = "",
currentTemplateSessionData;//pour comparer si ça a été modifié ou non






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

        if (devMode === true ) {console.log("[DATABASE] [TEMPLATE] [SESSION] modèle de session inséré :", newTemplateSession);};

        return newTemplateSession;
    } catch (err) {
        console.error("[DATABASE] [TEMPLATE] [SESSION] Erreur lors de l'insertion du modèle de session :", err);
    }
}



async function onLoadTemplateSessionNameFromDB() {
    templateSessionsNameList = {}; // Initialisation en objet

    try {
        const result = await db.allDocs({ include_docs: true }); // Récupère tous les documents

        // Filtrer et extraire uniquement les champs nécessaires sous forme de tableau
        let sessionsArray = result.rows
            .filter(row => row.doc.type === templateSessionStoreName)
            .map(row => ({
                id: row.doc._id,
                name: row.doc.sessionName
            }));

        // Trier alphabétique par sessionName
        sessionsArray.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

        // Reconstruire l'objet trié
        templateSessionsNameList = sessionsArray.reduce((acc, session) => {
            acc[session.id] = { name: session.name };
            return acc;
        }, {});

        if (devMode === true) {
            console.log("[DATABASE] [TEMPLATE] [SESSION] Templates chargés :", templateSessionsNameList);
        }
    } catch (err) {
        console.error("[DATABASE] [TEMPLATE] [SESSION] Erreur lors du chargement:", err);
    }
}


// Gestion si le nombre maximal de modèle de session atteints
function gestionMaxTemplateSessionReach() {
    // Gestion bouton new compteur
    document.getElementById("btnCreateTemplateSession").disabled = Object.keys(templateSessionsNameList).length >= maxTemplateSession ? true : false;
}



// Recherche de template de session par son id/key
async function findTemplateSessionById(templateId) {
    try {
        const template = await db.get(templateId); // Recherche dans la base
        if (devMode) console.log("Template trouvé :", template);
        return template; // Retourne l'objet trouvé
    } catch (err) {
        console.error("Erreur lors de la recherche du template :", err);
        return null; // Retourne null si non trouvé
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
            currentTemplateSessionID = this.id;
            onChangeMenu("ModifyTemplateSession");
            eventOpenTemplateSessionEditor("modification");
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

    // Actualisation de la liste d'affichage
    eventUpdateTemplateSessionList();
    
}




// Sequence d'actualisation de la liste d'affichage des modèles de session

async function eventUpdateTemplateSessionList() {
    // Récupère la liste des modèle de session depuis la base
    await onLoadTemplateSessionNameFromDB();


    console.log(templateSessionsNameList);

    // Traitement du bouton de limite de création
    gestionMaxTemplateSessionReach();

    // Affiche la liste des modèles de sessions
    onSetTemplateSessionNameList();
}




// actualise la liste des modèles de session
function onSetTemplateSessionNameList() {
    
    // Récupère le parent et le vide
    let parentRef = document.getElementById("divTemplateSessionListMenu");
    parentRef.innerHTML = "";

    //Affichage si aucun modèle de session
    if (Object.keys(templateSessionsNameList).length === 0 ) {
       parentRef.innerHTML = "Aucun modèle à afficher !";
       return
    }

    // Pour chaque ligne dans le tableau
    
    Object.keys(templateSessionsNameList).forEach(key=>{
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

    // Demande l'ouverture de l'éditeur en paramétrant le mode
    eventOpenTemplateSessionEditor("creation");



};



// Sequence d'ouverture de l'editeur de modele de session selon le mode choisi(creation ou modification)

async function eventOpenTemplateSessionEditor(mode){
    // Enregistre le mode d'ouverture
    templateSessionEditorMode = mode;



    switch (templateSessionEditorMode) {
        case "creation":
            // Demande de création du tableau vide
            onCreateTemplateSessionTableLine();
            break;
        case "modification":
            // Demande de création du tableau vide
            onCreateTemplateSessionTableLine();

            // Recherche les éléments dans la base
            let result = await findTemplateSessionById(currentTemplateSessionID);
            currentTemplateSessionData = {
                sessionName :result.sessionName,
                counterList: result.counterList
            };
            // Puis remplit le tableau 
            onSetTemplateSessionTableLine(currentTemplateSessionData);
            break;
    
        default:
            break;
    }

}




// fonction de génération des lignes du tableau
function onCreateTemplateSessionTableLine() {
    
    // Reférence le parent
    let parentRef = document.getElementById("bodyTableGenerateSessionEditor");

    // Reset le contenu du parent et le nom
    parentRef.innerHTML = "";
    document.getElementById("inputTemplateSessionName").value = "";

    // Génère le tableau
    for (let i = 0; i < maxCounter; i++) {
        new TableLineSession(parentRef,i); 
    }
}

// Fonction pour remplir les lignes du tableau
function onSetTemplateSessionTableLine(templateData) {
    console.log(templateData);

    // Set le nom de la session
    document.getElementById("inputTemplateSessionName").value = templateData.sessionName;

    //Boucle pour remplir les différents compteurs
    templateData.counterList.forEach((counter,index)=>{
        document.getElementById(`inputGenSessionNom_${index}`).value = counter.counterName;
        document.getElementById(`inputGenSessionSerie_${index}`).value = counter.serieTarget;
        document.getElementById(`inputGenSessionRep_${index}`).value = counter.repIncrement;
        // Couleur
        document.getElementById(`selectGenSessionColor_${index}`).value = counter.color;
        onChangeColorInGenSessionTable(index);
    }); 
    
    
    
    
}


async function onClickSaveFromTemplateSessionEditor() {

    // Masque le popup
    onLeaveMenu("TemplateSessionEditor");

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
    eventUpdateTemplateSessionList();

    // Notification
    onShowNotifyPopup(notifyTextArray.templateSessionCreated);
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


