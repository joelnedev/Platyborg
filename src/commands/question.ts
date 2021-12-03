import { Question, truthOrDare } from "../util/index.js";
import type { CommandInteraction, GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const question = interaction.options.getString("type") 
		? await truthOrDare.getRandomByType<Question>(interaction.options.getString("type") as ("NHIE" | "P" | "T" | "TD" | "D" | "WYR"))
		: await truthOrDare.getRandom();
	const type = question.type === "T" ? "Truth" : question.type === "D" ? "Dare" : question.type === "WYR" ? "Would You Rather" : question.type === "NHIE" ? "Never Have I Ever" : "Paranoia";
	const embed = new MessageEmbed()
		.setTitle(question.question)
		.setFooter(`Type: ${type} ID: ${question.id}`)
		.setColor(0x10958D)
		.setAuthor((interaction.member as GuildMember).displayName, interaction.user.displayAvatarURL());
}

export const help = {
	name: "question",
	description: "Send a truth or dare question",
	options: [
		{
			name: "type",
			description: "Type of question to ask ",
			type: ApplicationCommandOptionType.String,
			required: false,
			options: [
				{
					name: "Truth",
					value: "T"
				},
				{
					name: "Dare",
					value: "D"
				},
				{
					name: "Truth or Dare",
					value: "TD"
				},
				{
					name: "Never Have I Ever",
					value: "NHIE"
				},
				{
					name: "Would You Rather",
					value: "WYR"
				}
			]
		}
	]
}