module.exports = { // eslint-disable-line no-undef
	name: "inventory",
	description: "Shows the items in your inventory.",
	aliases: ["inv", "stuff", "bag"],
	args: false,
	usage: " ",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, Users) {
		async function inventory(Users, message){
			const target = message.author;
			const user = await Users.findOne({ where: { user_id: target.id } });
			const items = await user.getItems();

			if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
			return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(", ")}`);
		}
		inventory(Users, message);
	},
};