module.exports = { // eslint-disable-line no-undef
	name: "inventory",
	description: "Shows the items in your inventory.",
	aliases: ["inv", "stuff", "bag"],
	args: false,
	usage: " ",
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, currency, CurrencyShop, Users, Op, config, godModeUsers, errorReplies) {
		async function inventory(Users, interaction){
			const target = interaction.author;
			const user = await Users.findOne({ where: { user_id: target.id } });
			const items = await user.getItems();

			if (!items.length) return interaction.channel.send(`${target.tag} has nothing!`);
			return interaction.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(", ")}`);
		}
		inventory(Users, interaction);
	},
};