require('dotenv').config();
const fs = require('fs');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token } = require('./config.json');
const { commands } = require("./commands.js");
 
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

    if(message.content === "!addme"){
		let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let exist = false;
		res.forEach(element => {
            if(element[0] == message.author.username){
                exist = true;
            }
        });
        if(!exist){
            res.push([message.author.username, ""]);
            let newarray = JSON.stringify(res);
            fs.writeFileSync('eleves.json', newarray);
            message.reply(":white_check_mark: :white_check_mark: @"+message.author.username+" a été ajouté à la liste des élèves. :white_check_mark: :white_check_mark: ");
        }else{
            message.reply(":x: :x: @"+message.author.username+" est déjà dans la liste des élèves. :x: :x: ");
        }
    }

    if(message.content.slice(0,6) === "!setme"){
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        for(let i=0;i<res.length;i++){
            if(res[i][0] == message.author.username){
                res[i][1] = message.content.slice(7);
                let newarray = JSON.stringify(res);
                fs.writeFileSync('eleves.json', newarray);
                message.reply(":white_check_mark: :white_check_mark: Votre identifiant a été modifié. :white_check_mark: :white_check_mark: ");
            }
        }
    }

    if(message.content === "!delme"){
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let exist = false;
        for(let i=0;i<res.length;i++){
            if(res[i][0] == message.author.username){
                exist = true
                res.splice(i, 1);
                let newarray = JSON.stringify(res);
                fs.writeFileSync('eleves.json', newarray);
                message.reply(":white_check_mark: :white_check_mark: Tu n'es plus dans la liste ! :white_check_mark: :white_check_mark: ");
            }
        }
        if(!exist){
            message.reply(":x: :x: Tu n'es même pas dans la liste. :x: :x: ");
        }
    }

    if(message.content === "!listStudents"){
        let request = fs.readFileSync('eleves.json');
        let res = JSON.parse(request);
        let msg = "";
        let count = 0;
        res.forEach(element => {
            msg += count+" : "+element[0]+" - "+element[1]+"\n";
            count++;
        });
        message.reply(msg);
    }
};

const onReady = (message) => {
    console.log("Je suis prêt à vous écouter !");
};

client.on("ready", onReady);
client.on("message", onMessage);
client.login(token);
