module.exports = { // eslint-disable-line no-undef
	name: "post",
	description: "Show off your epic talent in #showcase",
	aliases: ["show", "showcase", "art"],
	usage: " [<caption>]",
	responseType: 2,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies, showcaseCooldown) {				
		// Creates a message embed and assigns properties on declaration.
		const embed = new Discord.MessageEmbed()
			.setAuthor(nickname, interaction.author.avatarURL())
			.setColor("#00ff00")
			.setTitle(`Showcase by ${interaction.member.nickname}`)
			// eslint-disable-next-line no-undef
			.setFooter("If you want to post your own showcase, go to any channel and type `/post`")
			.setTimestamp();
		
		// Assign properties if they exist
		if (interaction.attachments) {
			embed.setImage(interaction.attachments.last().proxyURL); 
		} else {
			embed.addField("No attachment", "The author didn't attach anything");
		}
		if (args[0]) {
			embed.setDescription(args.slice(0).join(" "));
		} else {
			embed.setDescription("The author didn't add a caption");
		}
		
		// Cooldown (but not for god mode users cause they may be testing the command)
		if (!godModeUsers.some(ID => interaction.author.id === ID)) {
			showcaseCooldown.add(interaction.author.id);
			// eslint-disable-next-line no-undef
			setTimeout(() => {
				showcaseCooldown.delete(interaction.author.id);
			}, 300000);
		}
		// Send the embed in #showcase
		bot.channels.cache.get("702481578529652796").send(embed);
	},
};