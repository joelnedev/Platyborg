import { MessageEmbed, CommandInteraction, GuildMember } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
import { platyborg } from "../util/index.js";
export const execute = async (interaction: CommandInteraction) => {
	// Sends an embed explaining PFC's self advertising policy
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const embed = new MessageEmbed()
		.setTitle("Self Advertising")
		.setColor(0x03b1fc)
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user.displayAvatarURL())
		.setDescription("We don’t currently allow self advertisement in this server for several reasons: \n- It devalues our partners \n- People could advertise malicious content (and we can’t make exceptions for servers with good intent) \n- People swarm here just to advertise, and it’s kinda dumb \n \n So apart from our partnered servers, Killer Bean-related social media content, and anything directly approved by spoons, you may not self advertise or advertise in this server. (Note: as mentioned, you can get prior approval from the owner.) Thanks for understanding.")
	interaction.reply({ embeds: [embed], ephemeral: !interaction.options.getBoolean("public", true) });
}
export const help = {
	name: "advertising",
	description: "Becomes spoons and commits murder over self advertising",
	options: [
		{
			name: "public",
			description: "Whether or not to show the message to everyone",
			type: ApplicationCommandOptionType.Boolean,
			required: true
		}
	]
}
