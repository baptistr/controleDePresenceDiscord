function convertVCS(){

    const fs = require('fs');
    const path = require('path');

    //cherche tous les fichiers avec un .vcs
    const dir = "convert-vsc-to-json";
    let files = [];
    files = fs.readdirSync(dir);
    
    files.forEach(element => {
        if(!element.includes(".vcs")){
            let myIndex = files.indexOf(element);
            files.splice(myIndex, 1);
        }
    });

    console.log("files contient : "+files.length);

    if(files.length == 0){
        return;
    }

    files.forEach(elementFile => {

        let request = fs.readFileSync('convert-vsc-to-json/'+elementFile);

        //split du vcs pour avoir une ligne dans chaque case dans un tableau
        let res = request.toString().split(/\r\n|\r|\n/);

        //les 4 premières lignes sont inutiles
        res = res.slice(4);

        let i = 0;
        let objEvent = []

        //creation d'un objet par cours/event dans un tableau
        res.forEach(element => {
            don = element.split(":");
            let obj = {};
            obj[don[0]] = don[1];
            objEvent[Math.floor(i/12)] = Object.assign(obj, objEvent[Math.floor(i/12)]);
            i++;
        });
        
        //dernière objet inutile
        objEvent.splice(-1,1);

        //j'insère dans un tableau les informations que nous voulons garder
        let tabCours = [];
        objEvent.forEach(element => {

            //conversion du format des dates en ts
            let maDate = [];
            maDate[0] = element.DTSTART.substr(0,4) // annee
            maDate[1] = element.DTSTART.substr(4,2)-1 // mois
            maDate[2] = element.DTSTART.substr(6,2) // jour
            maDate[3] = element.DTSTART.substr(9,2) // heure
            maDate[4] = element.DTSTART.substr(11,2) // minute
            maDate = new Date( maDate[0], maDate[1], maDate[2], maDate[3], maDate[4]);

            let maDateEnd = [];
            maDate[0] = element.DTEND.substr(0,4) // annee
            maDate[1] = element.DTEND.substr(4,2)-1 // mois
            maDate[2] = element.DTEND.substr(6,2) // jour
            maDate[3] = element.DTEND.substr(9,2) // heure
            maDate[4] = element.DTEND.substr(11,2) // minute
            maDateEnd = new Date( maDate[0], maDate[1], maDate[2], maDate[3], maDate[4]);

            tabCours.push([
                element.UID,
                maDate.getTime()/1000,
                maDateEnd.getTime()/1000,
            ]);
        });

        let req = fs.readFileSync('edt.json');
        let edt = JSON.parse(req);

        //je vérifie qu'il n'y a pas déjà les mêmes cours dans edt.json
        edt.forEach(edtElement => {
            tabCours.forEach(coursElement => {
                if(edtElement[0] == coursElement[0]){
                    let myIndex = tabCours.indexOf(coursElement);
                    tabCours.splice(myIndex, 1);
                }
            });
        });

        //j'ajoute les nouveaux cours dans edt
        edt = edt.concat(tabCours);

        console.log("edt.json possède maintenant "+edt.length+" cours qui sont prévus, vous en avez ajouté(s) "+tabCours.length);

        let newarray = JSON.stringify(edt);
        fs.writeFileSync('edt.json', newarray);
    });

    files.forEach(element => {
        fs.unlinkSync("convert-vsc-to-json/"+element);
    });

}

module.exports = { convertVCS };