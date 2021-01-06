module.exports = { // eslint-disable-line no-undef
	name: "Ping",
	description: "Ping!",
	aliases: [],
	args: false,
	usage: " ",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord) {
		const { pingReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		let then = new Date();
		message.channel.send("Pinging...");
		let now = new Date();
		let ping = now.getTime() - then.getTime();
		const embed = new Discord.MessageEmbed()
			.setColor("#03b1fc")
			.setTitle("Pong")
			.setDescription(pingReplies[Math.floor(Math.random() * pingReplies.length)])
			.addField("Ping (ms)", ping, true);
		message.channel.send(embed);
	},
};