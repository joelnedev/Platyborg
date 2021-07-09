import { blackMarket } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command?: any) {
		const user = await blackMarket.users.get(interaction.user?.id);
		const embed = new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
			.setColor("#03b1fc");

		if (!user.items.length) return interaction.reply({ embeds: [embed.setDescription("You don't have anything in your inventory.")] });

		const inventory: string[] = [];
		user.items.forEach(async (itemID) => {
			inventory.push((await blackMarket.items.get(itemID)).name);
		});
		interaction.reply({ embeds: [embed.addField("Inventory", inventory.join(",\n"))] });
	}
};