import { MessageEmbed, CommandInteraction, InteractionReplyOptions, GuildMember } from "discord.js";
import { Vagan } from "../util/exports";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {		
	// Sends an embed explaining KBC's self advertising policy
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);
	const embed = new MessageEmbed()
		.setTitle("Self Advertising")
		.setColor("#03b1fc")
		.setAuthor(member.displayName, member.user.displayAvatarURL())
		.setDescription("We don’t currently allow self advertisement in this server for several reasons: \n- It devalues our partners \n- People could advertise malicious content (and we can’t make exceptions for servers with good intent) \n- People swarm here just to advertise, and it’s kinda dumb \n \n So apart from our partnered servers, Killer Bean-related social media content, and anything directly approved by spoons, you may not self advertise or advertise in this server. (Note: as mentioned, you can get prior approval from the owner.) Thanks for understanding.")
	const options: InteractionReplyOptions = { embeds: [embed], ephemeral: false };
	interaction.options.find((arg: any) => arg.name === "public")?.value ? options.ephemeral = false : options.ephemeral = true;
	interaction.reply(options);
}
command.help = {
	name: "advertising",
	description: "Becomes spoons and commits murder over self advertising",
	options: [
		{
			name: "public",
			description: "Whether or not to show the message to everyone",
			type: 5,
			required: true
		}
	]
}
