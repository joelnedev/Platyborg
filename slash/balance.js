module.exports = { // eslint-disable-line no-undef
	name: "balance",
	description: "Check your on Cappucino's black market. You can also view other people's money by specifying who.",
	aliases: ["bal", "b"],
	args: false,
	usage: " [<user>]",
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, currency, CurrencyShop, Users, Op, config, godModeUsers, errorReplies) {
		// Finds the first mention in the message and sets them as the target. If none exists, use the message author instead.
		const target = interaction.args || interaction.author;

		// Sends the target's current balance.
		return interaction.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	},
};