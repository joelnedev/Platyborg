import { blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {

		// Set variables
		const item = await blackMarket.items.find("name", command.args.target);
		const user = await blackMarket.users.get(interaction.author?.id);
		const embed = new MessageEmbed()
			.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL());

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
			embed.setColor("FF0000");
		} else if (item.invShow) {
			await blackMarket.users.push("items", item.id, false);
			await blackMarket.subtract(interaction.author?.id, item.cost);
			if (item.requiredItems) {
				item.requiredItems.forEach(async Item => await blackMarket.users.remove(`${interaction.author?.id}.items`, Item));
			}
			embed.setColor("00FF00");
			embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
		} else {
			embed.setColor("00FF00");
			embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
			if (item.roleGain) {
				interaction.member?.roles.add(item.roleGain);				
			}
		}

		// Send the embed
		interaction.respond(undefined, { embed });
	}
};