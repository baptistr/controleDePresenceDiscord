const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder()
	.setName('addme')
	.setDescription("Sinscrire pour que le BOT puisse me connaître"),

	new SlashCommandBuilder()
	.setName('setme')
	.setDescription('Mettre à jour mes informations (prénom nom)')
    .addStringOption(option => option
		.setName('prenom_nom')
		.setDescription('Entre ton prénom et ton nom')
		.setRequired(true)
	),

	new SlashCommandBuilder()
	.setName('delme')
	.setDescription('Je supprime les données que possède le BOT'),

    new SlashCommandBuilder()
	.setName('liststudents')
	.setDescription('Afficher la liste de tous les étudiants enregistrés par le BOT'),

	new SlashCommandBuilder()
	.setName('addevent')
	.setDescription('Initialiser un évènement cours')
	.addIntegerOption(option => option
		.setName('nb_eleves')
		.setDescription("Nombre d'élèves qui doivent participer")
		.setRequired(true)
	)
	.addStringOption(option => option
		.setName('heure_de_fin')
		.setDescription('Heure de fin (hh:mm)')
		.setRequired(true)
	),

	new SlashCommandBuilder()
	.setName('delevent')
	.setDescription("Supprime l'évènement en cours"),

	new SlashCommandBuilder()
	.setName('joinevent')
	.setDescription("Rejoins l'évènement en cours"),

	new SlashCommandBuilder()
	.setName('liststudentsevent')
	.setDescription("Afficher la liste des étudiants en cours")
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);