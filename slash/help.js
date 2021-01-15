module.exports = { // eslint-disable-line no-undef
	name: "help",
	description: "Tells you what things there are and what the thing does.",
	aliases: ["h"],
	usage: " [<command>]",
	responseType: 5,
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		// Allows me to call the commands array later in the script.
		const { commands } = client;
		const { prefix } = config.bot;

		// If the user doesn't include arguments, send the regular help message and exit.
		if (!args.length) {
			const embed1 = new Discord.MessageEmbed()
				.setTitle("Stuff I can do")
				.setColor("#03b1fc")
				.setDescription(`Send \`${prefix}help [thing]\` to get info on a specific command`)
				.addField("Commands", commands.map(command => command.name).join("\n "), true);
			interaction.channel.send(embed1)
				.catch(error => {
					const embed = new Discord.MessageEmbed()
						.setTitle("Error 🚨")
						.setColor("#ff0000")
						.setAuthor(nickname, interaction.author.avatarURL())
						.addField("Error", "An error has occurred.");
					interaction.channel.send(embed
						.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
						.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
					bot.channels.cache.get("797151756613058600").send(embed.addField("Link:", bot.user.lastMessage.url).addField("Error:", error));
				}); return;
		}

		// If they ask for help on a specific command, check if that command exists and send an error message if it doesn't.
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		if (!command) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Error :rotating_light:")
				.setColor("#ff0000")
				.setAuthor(nickname, interaction.author.avatarURL())
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("Error", "Command not found/invalid syntax", true);
			interaction.channel.send(embed);
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
		interaction.channel.send(embed2);
	},
};