function convertVCS($fichier){

    const fs = require('fs');

    //récupération du fichier
    let request = fs.readFileSync('convert-vsc-to-json/'+$fichier+'.vcs');

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

    return objEvent;
}

module.exports = { convertVCS };