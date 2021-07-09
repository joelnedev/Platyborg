import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction, command: any) => {
	// Set variables
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);
	const user = await blackMarket.add(command.args.target, 0);
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, member.user.displayAvatarURL())
		.addField("Cash", `${user.cash}`)
		.addField("Bank", `${user.bank}`)
		.addField("Net Worth", `${user.cash + user.bank}`);

	// Send info
	interaction.reply({ embeds: [embed], ephemeral: true });
}