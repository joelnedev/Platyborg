module.exports = { // eslint-disable-line no-undef
	name: "post",
	description: "Show off your epic talent in #showcase",
	aliases: ["show", "showcase", "art"],
	usage: " [<caption>]",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, showcaseCooldown) {
		// eslint-disable-next-line no-undef
		const godModeUsers = require("../info/config.json");
				
		// Creates a message embed and assigns properties on declaration.
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setColor("#00ff00")
			.setTitle(`Showcase by ${message.member.nickname}`)
			// eslint-disable-next-line no-undef
			.setFooter("If you want to post your own showcase, go to # and type `/post`")
			.setTimestamp();
		
		// Assign properties if they exist
		if (message.attachments) {
			embed.setImage(message.attachments.last().proxyURL); 
		} else {
			embed.addField("No attachment", "The author didn't attach anything");
		}
		if (args[0]) {
			embed.setDescription(args.slice(0).join(" "));
		} else {
			embed.setDescription("The author didn't add a caption");
		}
		
		// Cooldown (but not for god mode users cause they may be testing the command)
		if (!godModeUsers.some(ID => message.author.id === ID)) {
			showcaseCooldown.add(message.author.id);
			// eslint-disable-next-line no-undef
			setTimeout(() => {
				showcaseCooldown.delete(message.author.id);
			}, 300000);
		}
		// Send the embed in #showcase
		message.client.channels.cache.get("702481578529652796").send(embed);
	},
};