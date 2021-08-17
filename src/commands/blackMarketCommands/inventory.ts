import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
	const user = await blackMarket.users.get(interaction.user?.id);
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, interaction.user?.displayAvatarURL())
		.setColor(0x03b1fc);

	if (!user.items.length) return interaction.reply({ embeds: [embed.setDescription("You don't have anything in your inventory.")] });

	const inventory: string[] = [];
	for (const itemId of user.items) inventory.push((await blackMarket.items.get(itemId)).name);
	interaction.reply({ embeds: [embed.addField("Inventory", inventory.join(",\n"))] });
}