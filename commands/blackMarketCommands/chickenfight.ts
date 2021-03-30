import { blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {
		return interaction.respond("This command is in progress and not available. Stay tuned, it'll go live soon!", { ephemeral: true });
	}
};