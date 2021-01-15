module.exports = { // eslint-disable-line no-undef
	name: "purpose",
	description: "Explains the relevance of its purpose.",
	responseType: 5,
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) { // eslint-disable-line no-unused-vars
		const { purposeReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		interaction.channel.send(purposeReplies[Math.floor(Math.random() * purposeReplies.length)]);
	},
};