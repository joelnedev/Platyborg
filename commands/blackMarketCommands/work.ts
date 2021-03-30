import { Bot, blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {

		// Set variables
		const Vagan: Bot = interaction.bot;
		const config = Vagan.config.economy.work;
		const add: number = command.tools.randomNumber(config.win.min, config.win.max);
		const replies: string[] = command.tools.replaceReplies(Vagan.config.replies.work, add);

		// Modify their balance, then send an embed with a random message containing their balance
		await blackMarket.users.math(`${interaction.author.id}.cash`, "add", add);
		const embed = new MessageEmbed()
			.setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
			.setDescription(replies[Math.floor(Math.random() * replies.length)])
			.setColor("#00FF00");
		interaction.respond(undefined, { embed });
	}
};