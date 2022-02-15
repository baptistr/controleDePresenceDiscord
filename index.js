const { Client, Intents } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { token, clientId, guildId, channel, mongoPath } = require('./config.json');
const MongoClient = require('mongodb').MongoClient;

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, option } = interaction;

	if (commandName === 'addme') {
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let exist = false;
		res.forEach(element => {
            if(element[0] == interaction.user.tag){
                exist = true;
            }
        });
        if(!exist){
            res.push([interaction.user.tag, ""]);
            let newarray = JSON.stringify(res);
            fs.writeFileSync('eleves.json', newarray);
            await interaction.reply(":white_check_mark: :white_check_mark: @"+interaction.user.tag+" a été ajouté à la liste des élèves. :white_check_mark: :white_check_mark: ");
        }else{
            await interaction.reply(":x: :x: @"+interaction.user.tag+" est déjà dans la liste des élèves. :x: :x: ");
        }
	} else if (commandName === 'setme') {
		let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        for(let i=0;i<res.length;i++){
            if(res[i][0] == interaction.user.tag){
                res[i][1] = interaction.options.getString("prenom_nom");
                let newarray = JSON.stringify(res);
                fs.writeFileSync('eleves.json', newarray);
                interaction.reply(":white_check_mark: :white_check_mark: Votre identifiant a été modifié. :white_check_mark: :white_check_mark: ");
            }
        }
	} else if (commandName === 'delme') {
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let exist = false;
        for(let i=0;i<res.length;i++){
            if(res[i][0] == interaction.user.tag){
                exist = true
                res.splice(i, 1);
                let newarray = JSON.stringify(res);
                fs.writeFileSync('eleves.json', newarray);
                interaction.reply(":white_check_mark: :white_check_mark: Tu n'es plus dans la liste ! :white_check_mark: :white_check_mark:");
            }
        }
        if(!exist){
            interaction.reply(":x: :x: Tu n'es même pas dans la liste. :x: :x:");
        }
	} else if (commandName === 'liststudents') {
		let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let msg = "";
        let count = 0;
        res.forEach(element => {
            msg += count+" : "+element[0]+" - "+element[1]+"\n";
            count++;
        });
        interaction.reply(msg);
	} else if (commandName === 'addevent') {
        let date = new Date();
        let dateNow = Math.floor(Date.now() / 1000);
        let request = fs.readFileSync('inProgress.json');
        let res = JSON.parse(request);
        console.log(res[5]+' - '+dateNow);
        if(res[0] == 1){
            interaction.reply(":x: :x: Un évènement est déjà en cours :x: :x:");
            return;
        }
        res[0] = 1;
        res[1] = interaction.options.getInteger("nb_eleves");

        res[2] = interaction.options.getString("heure_de_fin");
        let split = res[2].split(/[\sh:H/]+/);
        if(split[0].toString().length == 1){
            res[2] = "0"+split[0]+":"+split[1];
        } else {
            res[2] = split[0]+":"+split[1];
        }

        let hours = date.getHours().toString();
        if(hours.length == 1)
            hours="0"+hours;
        let minutes = date.getMinutes().toString();
        if(minutes.length == 1)
            minutes="0"+minutes;
        let seconds = date.getSeconds().toString();
        if(seconds.length == 1)
            seconds="0"+seconds;

        res[3] = hours+":"+minutes;
        res[4] = (((res[2].slice(0,2)-res[3].slice(0,2))*60)+(res[2].slice(3,5)-res[3].slice(3,5)))*60;
        if(res[4] <= 0){
            interaction.reply(":x: :x: Tu ne peux pas commmencer un évènement avec une heure qui est déjà passée :x: :x:");
            return;
        }
        res[5] = dateNow+res[4];
        res[6] = [];
        let newarray = JSON.stringify(res);
        fs.writeFileSync('inProgress.json', newarray);
        interaction.reply(":white_check_mark: :white_check_mark: L'évènement a été créé avec succès ! :white_check_mark: :white_check_mark:");

        setTimeout(() => {

            let request = fs.readFileSync('inProgress.json');
            let res = JSON.parse(request);

            client.channels.cache.get(channel).send(":warning: :warning: L'évènement est terminé, tu peux maintenant en initialiser un nouveau ! :warning: :warning:");
            let newEvent = {
                duration:res[4],
                endEvent:res[5],
                student:res[6]
            }
            
            MongoClient.connect(mongoPath, function(err, db) {
                if (err) throw err;
                let dbo = db.db("present");
                dbo.collection("present").insertOne(newEvent, function(err, res) {
                    if (err) throw err;
                    console.log("insert : "+newEvent);
                    db.close();
                });
            });

            res = [0];
            let newarray = JSON.stringify(res);
            fs.writeFileSync('inProgress.json', newarray);
            
        }, res[4]*1000);

	} else if (commandName === 'delevent') {

        let res = [];
        let newarray = JSON.stringify(res);
        fs.writeFileSync('inProgress.json', newarray);
        interaction.reply(":white_check_mark: :white_check_mark: L'évènement en cours a été supprimé ! :white_check_mark: :white_check_mark: ");

    }  else if (commandName === 'joinevent') {

        let request = fs.readFileSync('inProgress.json');
        let res = JSON.parse(request);
        if(res[0] == 0){
            interaction.reply(":x: :x: Aucun évènement est en cours :x: :x:");
            return;
        }
        let request2 = fs.readFileSync('eleves.json');
        let eleves = JSON.parse(request2);
        res[6].forEach(element => {
            if(element == interaction.user.tag){
                interaction.reply(":x: :x: Tu es déjà inscrit à l'évènement :x: :x:");
                return;
            }
        });
        for(let i = 0; i<eleves.length; i++){
            if(eleves[i][0] == interaction.user.tag){
                eleve = {};
                eleve.name = eleves[i][1];
                eleve.ts = Math.floor(Date.now() / 1000);
                res[6].push(eleve);
                interaction.reply(":white_check_mark: :white_check_mark: Tu as été inscrit avec succès :white_check_mark: :white_check_mark:");
                let newarray = JSON.stringify(res);
                fs.writeFileSync('inProgress.json', newarray);
                return;
            }
        }
        interaction.reply(":x: :x: Le bot ne te connait pas ... fait \"/addme\" et recommence cette commande ! :x: :x:");

    } else if(commandName === "liststudentsevent"){
        let request = fs.readFileSync('inProgress.json');
        let res = JSON.parse(request);
        if(res[0] == 0){
            interaction.reply(":x: :x: Aucun évènement est en cours :x: :x:");
            return;
        }else if(res[6].length == 0){
            interaction.reply(":x: :x: La liste est vide :x: :x:");
            return;
        }
        let msg = "";
        let count = 1;
        res[6].forEach(element => {
            for (const [key, value] of Object.entries(element)) {
                console.log(`${key}: ${value}`);
                msg += count+" : "+key+" - "+value+"\n";
            }
            count++;
        });
        interaction.reply(msg);
    }
});

const onReady = (message) => {
    console.log("Je suis prêt à vous écouter !");
};

client.on("ready", onReady);
client.login(token);
