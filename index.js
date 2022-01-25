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
                interaction.reply(":white_check_mark: :white_check_mark: Tu n'es plus dans la liste ! :white_check_mark: :white_check_mark: ");
            }
        }
        if(!exist){
            interaction.reply(":x: :x: Tu n'es même pas dans la liste. :x: :x: ");
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
	}
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

    //Initialiser un évènement cours
    /*if(message.content.slice(0,9) === "!addsheet"){
        if(!Number.isInteger(message.content.slice(10))){
            message.reply(":x: :x: Le paramètre doit être un nombre. :x: :x: ");
            return;
        }
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        res[0] = 1;
        res[1] = new Date().getTime();
    }*/
};

const onReady = (message) => {
    console.log("Je suis prêt à vous écouter !");
};

client.on("ready", onReady);
client.on("message", onMessage);
client.login(token);
