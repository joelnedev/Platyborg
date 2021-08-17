import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {

	// Set variables
	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
	const item = await blackMarket.items.find("name", interaction.user.id);
	const user = await blackMarket.users.get(interaction.user?.id);
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, interaction.user?.displayAvatarURL());

	// Let the user know if something went wrong, otherwise complete the action and make the embed.
	if (!item) {
		embed
			.setColor(0xFF0000)
			.setDescription("I couldn't find that item.");
	} else if (item.cost > user.cash) {
		embed
			.setColor(0xFF0000)
			.setDescription(`You don't have enough cash to buy ${item.name}`);
	} else if (item.requiredItems?.every(Item => user.items.includes(Item))) {
		const requiredItems: string[] = [];
		for (const Item of item.requiredItems) requiredItems.push((await blackMarket.items.get(Item)).name);
		embed
			.setColor(0xFF0000)
			.setDescription(`You don't have the required item(s). To craft this, you need: ${requiredItems.join(", ")}`);
	} else if (item.invShow) {
		await blackMarket.addItem(user.id, item.id);
		await blackMarket.subtract(interaction.user?.id, item.cost);
		if (item.requiredItems) {
			for (const Item of item.requiredItems) await blackMarket.users.remove(`${interaction.user?.id}.items`, Item);
		}
		embed
			.setColor(0x00FF00)
			.setDescription(item.gainMessage ?? `You now have ${item.name}. Thanks for the business.`);
	} else if (item.roleGain) {
		embed
			.setColor(0x00FF00)
			.setDescription(item.gainMessage ?? `You now have ${item.name}. Thanks for the business.`);
		if (item.roleGain) member.roles.add(item.roleGain);
	} else {
		embed
			.setColor(0x00FF00)
			.setDescription(item.gainMessage ?? `You now have ${item.name}. Thanks for the business.`)
	}

	// Send the embed
	interaction.reply({ embeds: [embed] });
}