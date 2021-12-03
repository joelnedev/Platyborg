import { platyborg } from "../util/index.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
		// Self explanatory 😼
		const member = await platyborg.PFC.members.fetch(interaction.user.id);
		const embed = new MessageEmbed()
			.setTitle("Baned!")
			.setColor(0x00ff00)
			.setDescription(platyborg.config.replies.ban[Math.floor(Math.random() * platyborg.config.replies.ban.length)])
			.setAuthor(member.nickname ?? interaction.user.username, interaction.user.displayAvatarURL())
			.setFooter("Nobody was baned in the makeing of this joek");
		interaction.reply({ embeds: [embed] });
	}
export const help = {
	name: "ban",
	description: "Pretends to ban someone"
}
