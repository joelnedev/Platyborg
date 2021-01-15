module.exports = { // eslint-disable-line no-undef
	name: "ban",
	description: "Pretends to ban someone",
	aliases: ["banned", "bane", "baned", "fuckyou"],
	responseType: 5,
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) { // eslint-disable-line no-unused-vars
		const { banReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		const embed = new Discord.MessageEmbed()
			.setTitle("Baned!")
			.setColor("#00ff00")
			.setDescription(banReplies[Math.floor(Math.random() * banReplies.length)])
			.setAuthor(nickname, interaction.author.avatarURL())
			.setFooter("Nobody was baned in the makeing of this joek");
		interaction.channel.send(embed);
	},
};