module.exports = { // eslint-disable-line no-undef
	name: "say",
	description: "Say what you say to say, then delete what you said and say why.",
	responseType: 2,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		interaction.channel.send(args.slice(0).join(" "));
	},
};