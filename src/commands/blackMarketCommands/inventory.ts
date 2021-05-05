import { blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command?: any) {
		const user = await blackMarket.users.get(interaction.author?.id);
		const embed = new MessageEmbed()
			.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
			.setColor("#03b1fc");

		if (!user.items.length) return interaction.respond(undefined, { embed: embed.setDescription("You don't have anything in your inventory.") });

		const inventory: string[] = [];
		user.items.forEach(async (itemID) => {
			inventory.push((await blackMarket.items.get(itemID)).name);
		});
		interaction.respond(undefined, { embed: embed.addField("Inventory", inventory.join(",\n")) });
	}
};