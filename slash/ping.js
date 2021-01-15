module.exports = { // eslint-disable-line no-undef
	name: "ping",
	description: "Ping!",
	aliases: [],
	args: false,
	usage: " ",
	responseType: 1,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		const { pingReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		let then = new Date();
		interaction.channel.send("Pinging...");
		let now = new Date();
		let ping = now.getTime() - then.getTime();
		const embed = new Discord.MessageEmbed()
			.setColor("#03b1fc")
			.setTitle("Pong")
			.setDescription(pingReplies[Math.floor(Math.random() * pingReplies.length)])
			.addField("Ping (ms)", ping, true);
		interaction.channel.send(embed);
	},
};