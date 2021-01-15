module.exports = { // eslint-disable-line no-undef
	name: "advertising",
	description: "Becomes spoons and commits murder over self advertising",
	aliases: ["sa", "selfadvertising"],
	args: false, 
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		// Sends a message explaining KBC's self advertising policy
		const embed = new Discord.MessageEmbed()
			.setTitle("Self Advertising")
			.setColor("#03b1fc")
			.setAuthor(nickname, interaction.author.avatarURL())
			.setDescription(`We don’t currently allow self advertisement in this server for several reasons:
	- It devalues our partners
	- People could advertise malicious content (and we can’t make exceptions for servers with good intent)
	- People swarm here just to advertise, and it’s kinda dumb
So apart from our partnered servers, Killer Bean-related social media content, and anything directly approved by spoons, you may not self advertise or advertise in this server. (Note: as mentioned, you can get prior approval from the owner.) Thanks for understanding.`);
		interaction.channel.send(embed);
	},
};