import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {

	// Set variables
	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
	const item = await blackMarket.items.find("name", interaction.options.getString("item", true));

	// Let the user know if Vagan can't find the item, otherwise assign properties if they exist.
	if (!item) return interaction.reply({ content: "I couldn't find that item.", ephemeral: true });

	const embed = new MessageEmbed()
		.setAuthor(member.displayName, interaction.user?.displayAvatarURL())
		.setColor(0x03b1fc)
		.setTitle(`Info for ${item.name}`)
		.setDescription(`${item.description}`)
		.addField("Cost", `${item.cost}`, true)
		.addField("Required item(s)", (item.requiredItems ? item.requiredItems.join(", ") : "None"), true)
		.addField("Role", (item.roleGain ? `<@&${(await Vagan.KBC.roles.fetch(item.roleGain))?.id}>` : "None"), true)
		.addField("Heist", (item.payout ? `Increases heist payout by ${item.payout}%` : item.winRate ? `Increases chance of winning heist by ${item.winRate}%` : "No effect on heists"), true)
		.addField("Inventory item", (item.invShow ? "✅" : "❌"));

	// Send the embed
	interaction.reply({ embeds: [embed] });
}