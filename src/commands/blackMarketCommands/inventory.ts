import { blackMarket, platyborg } from "../../util/index.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const user = await blackMarket.getUser(interaction.user?.id);
	const embed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user?.displayAvatarURL())
		.setColor(0x03b1fc);

	if (!user.items.length) return interaction.reply({ embeds: [ embed.setDescription("You don't have anything in your inventory.") ] });

	const inventory: string[] = [];
	for (const itemId of user.items) inventory.push((await blackMarket.items.get(itemId)).name);
	interaction.reply({ embeds: [ embed.addField("Inventory", inventory.join(",\n")) ] });
}