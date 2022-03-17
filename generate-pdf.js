const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const { mongoPath } = require('./config.json');
generatePdf(fs, MongoClient, mongoPath);

function generatePdf(fs, MongoClient, mongoPath){

    let dateNow = Math.floor(Date.now() / 1000);

    //un jour = 86400 secondes
    let jour = 86400;
    //commence à 08:00:00
    let matinDebut = jour+28800;
    //finie à 13:00:00
    let matinFin = jour+46800;
    //commence à 13:00:01
    let apremDebut = jour+46801;
    //finie à 18:00:00
    let apremFin = jour+64800;

    let resultat = [];
    let parEleve = [];
    let curseur = null;
    let values;

    MongoClient.connect(mongoPath, function(err, db) {
        if (err) throw err;
        let dbo = db.db("present");
        let collection = dbo.collection("present");
        values = collection
        .find({})
        .toArray();
        //"endEvent":{$gt:dateNow-518400, $lte:dateNow}    
    });

    console.log(values);
    return;

        
    //         { text: 'BELLEC CORENTIN', bold: true, fontSize: 10 },
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X",
    //         "X"
        
    // array.forEach(element => {
        
    // });
    
    

    res[6] = [{"name":"Baptiste Lemonnier","ts":1647527677}];
    res[5] = "test";

    const pdfmake = require('pdfmake');

    let msg = "";

    let bin = true;
    res[6].forEach(element => {
        for (const [key, value] of Object.entries(element)) {
            console.log(`${key}: ${value}`);
            if(bin){
                bin=false;
                msg += value;
            } else{
                bin=false;
                msg += " - "+value+"\n";
            }
        }
    });

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
                             { text: 'SEMAINE 50', bold: true },
                             { text: 'Lundi\n13/12/21', fontSize: 10 },
                             { text: 'Mardi\n14/12/21', fontSize: 10 },
                             { text: 'Mercredi\n15/12/21', fontSize: 10 },
                             { text: 'Jeudi\n16/12/21', fontSize: 10 },
                             { text: 'Vendredi\n17/12/21', fontSize: 10 }
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
                    body: [
                        [ 
                            { text: 'BELLEC CORENTIN', bold: true, fontSize: 10 },
                            "X",
                            "X",
                            "X",
                            "X",
                            "X",
                            "X",
                            "X",
                            "X",
                            "X",
                            "X"
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
                margin : [0,75,0,0]
            },
            {
                text:"Pour l'Université, le Responsable\npédagogique du diplôme,\nDate et signature",
                margin : [320,20,0,0],
                fontSize : 8
            }
        ]
    }
    
    let pdfDoc = pdf.createPdfKitDocument(docDefination, {});
    pdfDoc.pipe(fs.createWriteStream('pdf/appel-'+res[5]+'.pdf'));
    pdfDoc.end();
    
}

module.exports = { generatePdf };