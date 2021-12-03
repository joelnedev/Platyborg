import { platyborg } from "../util/index.js";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const content: string = interaction.options.getString("content")!;
	const anonSay = async () => {
		await interaction.reply({ content: "ok", ephemeral: true });
		await (interaction.channel as TextChannel).send(content); 
		(await platyborg.channels.fetch("688757903905259580") as TextChannel).send(`${interaction.user.tag} said: \n \`${content}\``);
	}

	!interaction.options.getBoolean("anonymous") === false
		? await interaction.reply({ content, allowedMentions: { parse: [] } })
		: anonSay();
}
export const help = {
	name: "say",
	description: "Say what you say to say",
	options: [
		{
			name: "content",
			description: "What the bot should say",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "anonymous",
			description: "Whether to show your input publicly",
			type: ApplicationCommandOptionType.Boolean,
			required: true
		}
	]
}
