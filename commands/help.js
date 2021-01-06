const { prefix } = require("../info/config.json"); // eslint-disable-line no-undef
module.exports = { // eslint-disable-line no-undef
	name: "help",
	description: "Tells you what things there are and what the thing does.",
	aliases: ["h"],
	usage: " [<command>]",
	execute(message, args, Discord, errorFunction) {
		// Allows me to call the errorReplies or commands arrays later in the script.
		const { errorReplies } = require("../info/randomMessges.json"); // eslint-disable-line no-undef
		const { commands } = message.client;

		// If the user doesn't include arguments, send the regular help message and exit.
		if (!args.length) {
			const embed1 = new Discord.MessageEmbed()
				.setTitle("Stuff I can do")
				.setColor("#03b1fc")
				.setDescription(`Send \`${prefix}help [thing]\` to get info on a specific command`)
				.addField("Commands", commands.map(command => command.name).join("\n "), true);
			message.channel.send(embed1)
				.catch(error => {
					errorFunction(message, error);
				}); return;
		}

		// If they ask for help on a specific command, check if that command exists and send an error message if it doesn't.
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		if (!command) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Error :rotating_light:")
				.setColor("#ff0000")
				.setAuthor(message.member.nickname, message.author.avatarURL())
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("Error", "Command not found/invalid syntax", true);
			message.channel.send(embed);
			return;
		}

		// Prepares an embed and assigns 2 properties on declaration.
		const embed2 = new Discord.MessageEmbed()
			.setTitle(command.name)
			.setColor("#03b1fc");

		// Assigns properties if they exist, then sends the embed.
		if (command.aliases) embed2.addField("Aliases", command.aliases.join(", "), false);
		if (command.description) embed2.addField("Description", command.description, false);
		if (command.usage) embed2.addField("Usage", `${prefix}${command.name} ${command.usage}`, false);
		if (command.args) embed2.addField("Arguments required", ":white_check_mark:", true);
		else embed2.addField("Arguments required", ":x:", true);
		message.channel.send(embed2);
	},
};