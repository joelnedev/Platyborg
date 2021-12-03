import { blackMarket, platyborg } from "../../util/index.js";
import { CommandInteraction, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
	// Set variables
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const user = await blackMarket.getUser(interaction.options.getUser("user") ? interaction.options.getUser("user")!.id : interaction.user.id);
	const beancoin = platyborg.emoji.randomBeancoin();
	const embed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user.displayAvatarURL())
		.addField("Cash", `${beancoin}${user.cash}`)
		.addField("Bank", `${beancoin}${user.bank}`)
		.addField("Net Worth", `${beancoin}${user.cash + user.bank}`);

	// Send info
	interaction.reply({ embeds: [ embed ], ephemeral: true });
}