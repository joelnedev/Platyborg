import { Vagan } from "../util/exports.js";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);
	const content: string = interaction.options.find(arg => arg.value === "content")?.value as string;
	const anonSay = async () => {
		await interaction.reply({ content: "ok", ephemeral: true });
		await (interaction.channel as TextChannel).send(content); 
		(await Vagan.channels.fetch("688757903905259580") as TextChannel).send(`${member.user.tag} said: \n \`${content}\``);
	}

	interaction.options.find(arg => arg.name === "anonymous")?.value === false
		? await interaction.reply({ content, allowedMentions: { parse: [] } })
		: anonSay();
}
command.help = {
	name: "say",
	description: "Say what you say to say",
	options: [
		{
			name: "content",
			description: "What the bot should say",
			type: 3,
			required: true
		},
		{
			name: "anonymous",
			description: "Whether to show your input publicly",
			type: 5,
			required: true
		}
	]
}
