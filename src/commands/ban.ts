import { Vagan } from "../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
		// Self explanatory 😼
		const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
		const embed = new MessageEmbed()
			.setTitle("Baned!")
			.setColor(0x00ff00)
			.setDescription(Vagan.config.replies.ban[Math.floor(Math.random() * Vagan.config.replies.ban.length)])
			.setAuthor(member.displayName, member.user.displayAvatarURL())
			.setFooter("Nobody was baned in the makeing of this joek");
		interaction.reply({ embeds: [embed] });
	}
export const help = {
	name: "ban",
	description: "Pretends to ban someone"
}
