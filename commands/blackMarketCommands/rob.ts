import { Bot, blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {

		// Set variables
		const Vagan: Bot = interaction.bot;
		const config = Vagan.config.economy.crime;
		const user = await blackMarket.users.get(interaction.author?.id);
		const target = await blackMarket.users.get(command.args.target);
		const fail: () => number = () => (Math.random() * ((user.bank + user.cash) / (target.cash + (user.bank + user.cash))));
		const failed: number = fail();
		const add: number = command.tools.randomNumber(config.win.min, config.win.max);
		const remove: number = command.tools.randomNumber(config.fail.min, config.fail.max);
		const winReplies = command.tools.replaceReplies(Vagan.config.replies.rob.win, add);
		const failReplies = command.tools.replaceReplies(Vagan.config.replies.rob.fail, remove);

		// Modify the balances based on if they fail or not, then send an embed with a random message containing their balance
		failed > 0.5 ? await blackMarket.add(interaction.author?.id, add) : await blackMarket.subtract(interaction.author?.id, remove);
		if (failed > 0.5) await blackMarket.subtract(command.target.id, add, "bank");

		const embed = new MessageEmbed()
			.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
			.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
			.setColor(failed > 0.5 ? "00FF00" : "FF0000");

		interaction.respond(undefined, { embed });
	}
};