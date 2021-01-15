module.exports = { // eslint-disable-line no-undef
	name: "transfer",
	description: "Transfers money to another user.",
	aliases: [],
	args: false,
	usage: " <user> <amount>",
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, currency, CurrencyShop, Users, Op, config, godModeUsers, errorReplies) {
		const currentAmount = currency.getBalance(interaction.author.id);
		const transferAmount = args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = interaction.args;

		if (!transferAmount || isNaN(transferAmount)) {
			return interaction.channel.send(new Discord.MessageEmbed()
				.setAuthor(nickname, interaction.author.avatarURL)
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("Error", "That's not a valid amount.")
				.addField("Usage", `${config.bot.prefix}${this.usage}`));
		}

		if (transferAmount > currentAmount) {
			return interaction.channel.send(new Discord.MessageEmbed()
				.setAuthor(nickname, interaction.author.avatarURL)
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("Error", `You don't have enough money. You currently have ${currentAmount}`)
				.addField("Usage", `${config.bot.prefix}${this.usage}`));
		}

		if (transferAmount <= 0) {
			return interaction.channel.send(new Discord.MessageEmbed()
				.setAuthor(nickname, interaction.author.avatarURL)
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("Error", "You can't transfer a negative amount of money.")
				.addField("Usage", `${config.bot.prefix}${this.usage}`));
		}
		currency.add(interaction.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return interaction.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(interaction.author.id)}💰`);
	},
};