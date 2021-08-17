import { Bot, blackMarket, Vagan, randomNumber, replaceReplies } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {

	// Set variables
	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
	const config = Vagan.config.economy.crime;
	const user = await blackMarket.users.get(member.user.id);
	const target = await blackMarket.users.get(interaction.options.getUser("user", true).id);
	const failed = (Math.random() * ((user.bank + user.cash) / (target.cash + (user.bank + user.cash))));
	const add = randomNumber(config.win.min, config.win.max);
	const remove = randomNumber(config.fail.min, config.fail.max);
	const winReplies = replaceReplies(Vagan.config.replies.rob.win, add);
	const failReplies = replaceReplies(Vagan.config.replies.rob.fail, remove);

	// Modify the balances based on if they fail or not, then send an embed with a random message containing their balance
	failed > 0.5 ? await blackMarket.add(member.user.id, add) : await blackMarket.subtract(member.user.id, remove);
	if (failed > 0.5) await blackMarket.subtract(target.id, add, "bank");

	const embed = new MessageEmbed()
		.setAuthor(member.displayName, member.user.displayAvatarURL())
		.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
		.setColor(failed > 0.5 ? 0x00FF00 : 0xFF0000);

	interaction.reply({ embeds: [embed] });
}