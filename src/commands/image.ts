import { Vagan } from "../util/exports.js";
import { CommandInteraction, CommandInteractionOption, MessageEmbed } from "discord.js";
import { readdirSync } from "fs";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const images = readdirSync("../util/images");
	const imageIndex = images.findIndex(Image => Image.startsWith(interaction.options.getString("image")!));

	// Send the image if it exists, otherwise send an error
	imageIndex >= 0
		? await interaction.reply({ embeds: [new MessageEmbed().setImage(`attachment://${images[imageIndex]}`)], files: [`../util/images/${images[imageIndex]}`] })
		: await interaction.reply({ content: "Not found 😩", ephemeral: true });
}
export const help = {
	name: "image",
	description: "Sends a pre-defined image",
	options: [
		{
			name: "image",
			description: "The image to send",
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: "beanos",
					value: "beanos"
				},
				{
					name: "kill",
					value: "kill"
				}
			]
		}
	]
}
