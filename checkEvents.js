function checkEvents(fs, client, channel){

    //Si il y a un évènement en cours, je ne vais pas plus loin
    let request = fs.readFileSync('inProgress.json');
    let res = JSON.parse(request);
    if(res[0] == 1){
        return;
    }

    //j'examine le edt.json
    let edt = fs.readFileSync('edt.json');
    edt = JSON.parse(edt);

    //je vérifie si l'heure de maintenant correpond à une date d'un évènement dans l'edt.json
    let dateNow = Math.floor(Date.now() / 1000);
    let heureDebut = null;
    let heureFin = null; 
    let event = false;
    edt.forEach(element => {
        if(dateNow > element[1] && dateNow < element[2]){
            //si oui, je récupère le l'heure du début et de fin de l'évènement
            client.channels.cache.get(channel).send(":warning: :warning: Un évènement va bientôt démarrer ! :warning: :warning:");

            heureDebut = element[1];
            heureFin = element[2];
            //une fois sauvegardé, je peux le supprimer
            let myIndex = edt.indexOf(element);
            edt.splice(myIndex, 1);

            event = true;
        }
    });

    //ne pas aller plus loin si aucun event ne possède le bon timestamp
    if(!event){
        return;
    }

    console.log("Un évènement a commencé");

    //pour éviter d'avoir des évènements obselètes dans le fichier
    edt.forEach(element => {
        if(element[2] < dateNow){
            let myIndex = edt.indexOf(element);
            edt.splice(myIndex, 1);
        }
    });

    //je renvoie le json avec la modification
    edt = JSON.stringify(edt);
    fs.writeFileSync('edt.json', edt);

    //je modifie les données de l'évènement en cours dans inProgress
    res[0] = 1;
    res[1] = null;
    res[2] = null;
    res[3] = null;
    res[4] = heureFin-heureDebut;
    res[5] = heureFin;
    res[6] = [];
    let newarray = JSON.stringify(res);
    fs.writeFileSync('inProgress.json', newarray);

    client.channels.cache.get(channel).send(":white_check_mark: :white_check_mark: L'évènement a démarré avec succès, vous pouvez maintenant signer ! :white_check_mark: :white_check_mark:");

    //j'attends que l'évènement soit terminé pour envoyer les données sur mongodb et je réinitialise le fichier inProgress
    setTimeout(() => {

        let request = fs.readFileSync('inProgress.json');
        let res = JSON.parse(request);

        //creation de l'objet pour l'insérer dans mongodb
        client.channels.cache.get(channel).send(":warning: :warning: L'évènement est terminé, tu peux maintenant en initialiser un nouveau ! :warning: :warning:");
        let newEvent = {
            duration:res[4],
            endEvent:res[5],
            pdfPath:'pdf/appel-'+res[5]+'.pdf',
            student:res[6]
        }
        
        MongoClient.connect(mongoPath, function(err, db) {
            if (err) throw err;
            let dbo = db.db("present");
            dbo.collection("present").insertOne(newEvent, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });

        //je re initialise le contenu de res
        res = [0];
        let newarray = JSON.stringify(res);
        fs.writeFileSync('inProgress.json', newarray);
        
    }, res[4]*1000);
}

module.exports = { checkEvents };