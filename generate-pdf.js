function generatePdf(res){

    const fs = require('fs');
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
        header:{
            margin : [0,20,0,30],
            alignment : "center",
            fontSize : 15,
            text : "Fiche d'appel"
        },
        content:[
            msg
        ]
    }
    
    let pdfDoc = pdf.createPdfKitDocument(docDefination, {});
    pdfDoc.pipe(fs.createWriteStream('pdf/appel-'+res[5]+'.pdf'));
    pdfDoc.end();
    
}

module.exports = { generatePdf };