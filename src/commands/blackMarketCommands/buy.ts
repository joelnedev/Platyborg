import { blackMarket } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const item = await blackMarket.items.find("name", command.args.target);
		const user = await blackMarket.users.get(interaction.user?.id);
		const embed = new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL());

		// Let the user know if something went wrong, otherwise complete the action and make the embed.
		if (!item) {
			embed.setDescription("I couldn't find that item.");
			embed.setColor("#FF0000");
		} else if (item.cost > user.cash) {
			embed.setDescription(`You don't have enough cash to buy ${item.name}`)
			embed.setColor("#FF0000");
		} else if (item.requiredItems?.every(Item => user.items.includes(Item))) {
			const requiredItems: string[] = [];
			item.requiredItems.forEach(async Item => requiredItems.push((await blackMarket.items.get(Item)).name));
			embed.setDescription(`You don't have the required item(s). To craft this, you need: ${requiredItems.join(", ")}`);
			embed.setColor(0xFF0000);
		} else if (item.invShow) {
			await blackMarket.users.push("items", item.id, false);
			await blackMarket.subtract(interaction.user?.id, item.cost);
			if (item.requiredItems) {
				item.requiredItems.forEach(async Item => await blackMarket.users.remove(`${interaction.user?.id}.items`, Item));
			}
			embed.setColor(0x00FF00);
			embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
		} else {
			embed.setColor(0x00FF00);
			embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
			if (item.roleGain) {
				(interaction.member as GuildMember)?.roles.add(item.roleGain);
			}
		}

		// Send the embed
		interaction.reply({ embeds: [embed] });
	}
};