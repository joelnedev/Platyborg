import { Bot, blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);
		const config = Vagan.config.economy.crime;
		const user = await blackMarket.users.get(member.user.id);
		const target = await blackMarket.users.get(command.args.target);
		const fail: () => number = () => (Math.random() * ((user.bank + user.cash) / (target.cash + (user.bank + user.cash))));
		const failed: number = fail();
		const add: number = command.tools.randomNumber(config.win.min, config.win.max);
		const remove: number = command.tools.randomNumber(config.fail.min, config.fail.max);
		const winReplies = command.tools.replaceReplies(Vagan.config.replies.rob.win, add);
		const failReplies = command.tools.replaceReplies(Vagan.config.replies.rob.fail, remove);

		// Modify the balances based on if they fail or not, then send an embed with a random message containing their balance
		failed > 0.5 ? await blackMarket.add(member.user.id, add) : await blackMarket.subtract(member.user.id, remove);
		if (failed > 0.5) await blackMarket.subtract(command.target.id, add, "bank");

		const embed = new MessageEmbed()
			.setAuthor(member.displayName, member.user.displayAvatarURL())
			.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
			.setColor(failed > 0.5 ? 0x00FF00 : 0xFF0000);

		interaction.reply({ embeds: [embed] });
	}
};