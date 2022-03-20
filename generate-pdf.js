function generatePdf(fs, MongoClient, mongoPath){

    const dateNow = Math.floor(Date.now() / 1000);
    let tabCroix = new Map();
    const currentdate = new Date();
    let oneJan = new Date(currentdate.getFullYear(),0,1);
    //permet d'obtenir le nombre de jours dans l'année
    let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    //permet d'obtenir le numéro de la semaine
    let weeklyNumber = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7); 

    //un jour = 86400 secondes
    let jour = 86400;
    //commence à 08:00:00
    let matinDebut = 28800;
    //finie à 13:00:00
    let matinFin = 46800;
    //commence à 13:00:01
    let apremDebut = 46801;
    //finie à 18:00:00
    let apremFin = 64800;

    //génére la liste des jours passés de la semaine
    let dateInPast = [];
    for (let i = 2; i < 7; i++) {
        let x = dateNow-(jour*i);
        x = new Date(x*1000);
        x = x.getDate()+"/"+x.getMonth()+"/"+x.getFullYear();
        dateInPast.push(x);
    }

    //Je récupère les datas depuis le début de la semaine
    MongoClient.connect(mongoPath, function(err, db) {
        if (err) throw err;
        let dbo = db.db("present");
        let collection = dbo.collection("present");
        values = collection
        .find({"endEvent":{$gt:dateNow-518400, $lte:dateNow}})
        .toArray()
        .then((results, error) => {
            if(error)
                return null;
            else{
                mongoValues(results);
            }
        })    
    });

    //Récupération des users et des ts
    const mongoValues = (values) => {
        let users = [];
        let user;
        values.forEach(element => {
            element = Object.entries(element);
            element.forEach(element2 => {
                if(element2[0] == "student")
                    if(element2[1].length != 0){
                        element2[1].forEach(element3 => {
                            user = Object.entries(element3);
                                users.push([user[0][1].toUpperCase(), user[1][1]]);
                        });
                    }
            });
        });
        initialiseData(users);
    }
    const initialiseData = (values) => {
        values.forEach(element => {
            //si l'element n'existe pas, je l'initialise
            if(!tabCroix.has(element[0]))
                tabCroix.set(element[0], [
                    { text: element[0], bold: true, fontSize: 10 },
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                ]);

            /* 
            Savoir entre quelles valeurs se situe le ts a laquelle la personne à signer.
            Permet de savoir si il a signé le matin ou l'après midi durant un jour de la semaine
            */
            let user;
            switch (true) {
                case element[1] >= dateNow-(jour*6)+matinDebut && element[1] <= dateNow-(jour*6)+matinFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[1] = "X";
                    tabCroix.set(element[0], user);
                    break;
                case element[1] >= dateNow-(jour*6)+apremDebut && element[1] <= dateNow-(jour*6)+apremFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[2] = "X";
                    tabCroix.set(element[0], user);
                    break; 
                case element[1] >= dateNow-(jour*5)+matinDebut && element[1] <= dateNow-(jour*5)+matinFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[3] = "X";
                    tabCroix.set(element[0], user);
                    break;
                case element[1] >= dateNow-(jour*5)+apremDebut && element[1] <= dateNow-(jour*5)+apremFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[4] = "X";
                    tabCroix.set(element[0], user);
                    break; 
                case element[1] >= dateNow-(jour*4)+matinDebut && element[1] <= dateNow-(jour*4)+matinFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[5] = "X";
                    tabCroix.set(element[0], user);
                    break;
                case element[1] >= dateNow-(jour*4)+apremDebut && element[1] <= dateNow-(jour*4)+apremFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[6] = "X";
                    tabCroix.set(element[0], user);
                    break; 
                case element[1] >= dateNow-(jour*3)+matinDebut && element[1] <= dateNow-(jour*3)+matinFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[7] = "X";
                    tabCroix.set(element[0], user);
                    break;
                case element[1] >= dateNow-(jour*3)+apremDebut && element[1] <= dateNow-(jour*3)+apremFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[8] = "X";
                    tabCroix.set(element[0], user);
                    break; 
                case element[1] >= dateNow-(jour*2)+matinDebut && element[1] <= dateNow-(jour*2)+matinFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[9] = "X";
                    tabCroix.set(element[0], user);
                    break;
                case element[1] >= dateNow-(jour*2)+apremDebut && element[1] <= dateNow-(jour*2)+apremFin:
                    user = Array.from(tabCroix.get(element[0]));
                    user[10] = "X";
                    tabCroix.set(element[0], user);
                    break; 
            }
        });

        //recuperation des valeurs de la map
        let content = [];
        Array.from(tabCroix.values()).forEach(element => {
            content.push(element);      
        });

        displayPDF(content);
    }

    const displayPDF = (content) => {
        const pdfmake = require('pdfmake');

        const fonts = {
            Roboto: {
                normal : "pdf/fonts/Roboto-Regular.ttf",
                bold : "pdf/fonts/Roboto-Bold.ttf"
            }
        }
        
        let pdf = new pdfmake(fonts);
        
        let docDefination = {
            pageMargins: [ 10, 60, 0, 60 ],
            header:{
                margin : [0,20,0,30],
                alignment : "center",
                fontSize : 16,
                text : "FEUILLE D'EMARGEMENT",
                color : "#1f4b88"
            },
            footer:{
                table: {
                    headerRows: 1,
                    widths: [150,34,33,34,33,34,33,34,33,34,33],
                    body: [
                        [ 
                            { text: 'SIGNATURE INTERVERNANTS', italic:true, fontSize:11},
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    ]
                },
                alignment:'center',
                margin : [10,0,0,0],
            },
            content:[
                {
                    columns:[
                        {
                            width:100,
                            image: 'pdf/img/pole-alternance.png'
                        },
                        {
                            alignment : "center",
                            text : "(Uniquement pour les alternants)",
                            margin : [-80,-21,0,0],
                            fontSize : 9,
                            color : "#1f4b88"
                        },
                    ],
                },
                {
                    margin : [60,30,0,0],
                    text:"FORMATION : LP CDTL DevCloud",
                    fontSize : 11,
                    color : "#1f4b88"
                },
                {
                    alignment : "center",
                    fontSize : 9,
                    margin : [0,40,0,20],
                    text:"Ce document permet au Pôle Alternance de l’université de rendre compte de votre assiduité auprès des instances compétentes (OPCO, Employeur,CFA…)"
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [150,76,76,76,76,76],
                        body: [
                            [ 
                                { text: 'SEMAINE '+weeklyNumber, bold: true },
                                { text: 'Lundi\n'+dateInPast[4], fontSize: 10 },
                                { text: 'Mardi\n'+dateInPast[3], fontSize: 10 },
                                { text: 'Mercredi\n'+dateInPast[2], fontSize: 10 },
                                { text: 'Jeudi\n,'+dateInPast[1], fontSize: 10 },
                                { text: 'Vendredi\n'+dateInPast[0], fontSize: 10 }
                            ]
                        ]
                    },
                    alignment:'center'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [150,34,33,34,33,34,33,34,33,34,33],
                        body: [
                            [ 
                                { text: 'NOM-PRENOM', bold: true, fontSize: 9 },
                                { text: 'Matin', fontSize: 8 },
                                { text: 'Après-\nmidi', fontSize: 8 },
                                { text: 'Matin', fontSize: 8 },
                                { text: 'Après-\nmidi', fontSize: 8 },
                                { text: 'Matin', fontSize: 8 },
                                { text: 'Après-\nmidi', fontSize: 8 },
                                { text: 'Matin', fontSize: 8 },
                                { text: 'Après-\nmidi', fontSize: 8 },
                                { text: 'Matin', fontSize: 8 },
                                { text: 'Après-\nmidi', fontSize: 8 }
                            ]
                        ]
                    },
                    alignment:'center'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: [150,34,33,34,33,34,33,34,33,34,33],
                        body: content
                    },
                    alignment:'center'
                },
                {
                    text:"Pour l'Université, le Responsable\npédagogique du diplôme,\nDate et signature",
                    margin : [320,20,0,0],
                    fontSize : 8
                }
            ]
        }
        
        let pdfDoc = pdf.createPdfKitDocument(docDefination, {});
        pdfDoc.pipe(fs.createWriteStream('pdf/semaine-'+weeklyNumber+'.pdf'));
        pdfDoc.end();
    }
}

module.exports = { generatePdf };