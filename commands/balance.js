module.exports = { // eslint-disable-line no-undef
	name: "balance",
	description: "Check your on Cappucino's black market. You can also view other people's money by specifying who.",
	aliases: ["bal", "b"],
	args: false,
	usage: " [<user>]",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, currency) {
		// Finds the first mention in the message and sets them as the target. If none exists, use the message author instead.
		const target = message.mentions.users.first() || message.author;

		// Sends the target's current balance.
		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	},
};