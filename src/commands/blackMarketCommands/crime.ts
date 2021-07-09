import { Vagan, blackMarket } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const config = Vagan.config.economy.crime;
		const fail: () => number = () => Math.random() * config.failRate;
		const failed: number = fail();
		const add: number = command.tools.randomNumber(config.win.min, config.win.max);
		const remove: number = command.tools.randomNumber(config.fail.min, config.fail.max);
		const winReplies: string[] = command.tools.replaceReplies(Vagan.config.replies.crime.win, add);
		const failReplies: string[] = command.tools.replaceReplies(Vagan.config.replies.crime.fail, remove);

		// Modify their balance based on if they fail or not, then send an embed with a random message containing their balance
		failed > 0.5 ? await blackMarket.add(interaction.user?.id, add) : await blackMarket.subtract(interaction.user?.id, remove);

		const embed = new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
			.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
			.setColor(failed > 0.5 ? 0x00FF00 : 0xFF0000);

		interaction.reply({ embeds: [embed] });
	}
};