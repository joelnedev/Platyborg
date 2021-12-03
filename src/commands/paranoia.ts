import { Paranoia, platyborg, truthOrDare } from "../util/index.js";
import { CommandInteraction, GuildMember, MessageEmbed, TextChannel, User, Webhook, WebhookClient } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const question = await truthOrDare.getRandomByType<Paranoia>("P");
	const embed = new MessageEmbed()
		.setTitle(question.question)
		.setColor(0x10958D)
}

export const help = {
	name: "paranoia",
	description: "Send or answer a paranoia question",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "send",
			description: "Sends a paranoia question to a user",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The user to send the question to"
				}
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "answer",
			description: "Answer a pending paranoia question",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "answer",
					description: "Your answer to the question"
				}
			]
		}/* ,
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "cancel",
			description: "Cancel a pending paranoia question",
		} */ // I don't think this is needed, but if the system works weirdly, it might be useful
	]
}