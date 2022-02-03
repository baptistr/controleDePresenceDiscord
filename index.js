const { Client, Intents } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { token, clientId, guildId } = require('./config.json');

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
        let dateNow = Math.floor(dateStamp / 1000);
        let request = fs.readFileSync('inProgress.json');
        let res = JSON.parse(request);
        console.log(res[5]+' - '+dateNow);
        if(res[5] > dateNow){
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
        let newarray = JSON.stringify(res);
        fs.writeFileSync('inProgress.json', newarray);
        interaction.reply(":white_check_mark: :white_check_mark: L'évènement a été créé avec succès ! :white_check_mark: :white_check_mark:");

	} else if (commandName === 'delevent') {

        let res = [];
        let newarray = JSON.stringify(res);
        fs.writeFileSync('inProgress.json', newarray);
        interaction.reply(":white_check_mark: :white_check_mark: L'évènement en cours a été supprimé ! :white_check_mark: :white_check_mark: ");
    
});
 
const onMessage = (message) => {

    if(message.content === "!present"){
        message.reply("Combien d'élève doivent assister aux cours ?");
        const collector = message.channel.createMessageCollector({ message, time: 15000 });
        console.log(collector)
        collector.on('collect', message => {
            if(message.author.bot === true){
                return;
            }
            message.reply("Vous voulez donc avoir "+message.content+" élèves dans se cours.");
        });
    }
};

const onReady = (message) => {
    console.log("Je suis prêt à vous écouter !");
};

client.on("ready", onReady);
client.on("message", onMessage);
client.login(token);
