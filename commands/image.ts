import { GlobalCommand, Interaction } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
import { readdirSync } from "fs";
export default new GlobalCommand({
	name: "image",
	description: "Sends a pre-defined image",
	options: [
		{
			name: "image",
			description: "The image to send",
			type: 3,
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
	],
	async execute(interaction: Interaction) {
		const images = readdirSync("../util/images");
		const imageIndex = (images.includes(interaction.args[0].value) ? images.findIndex(Image => Image === interaction.args[0].value) : null);
		
		// Send the image if it exists, otherwise send an error
		imageIndex ? await interaction.respond("\u200b").then(() => {interaction.channel.send(new MessageEmbed().setImage(`../util/images/${images[imageIndex]}`))}) : await interaction.respond("Not found 😩", { ephemeral: true });
	},
});