import { Bot, blackMarket, platyborg, randomNumber, replaceReplies } from "../../util/index.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {

	// Set variables
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const config = platyborg.config.economy.crime;
	const user = await blackMarket.getUser(interaction.user.id);
	const target = await blackMarket.getUser(interaction.options.getUser("user", true).id);
	const failed = (Math.random() * ((user.bank + user.cash) / (target.cash + (user.bank + user.cash))));
	const add = randomNumber(config.win.min, config.win.max);
	const remove = randomNumber(config.fail.min, config.fail.max);
	const winReplies = await replaceReplies(platyborg.config.replies.rob.win, add);
	const failReplies = await replaceReplies(platyborg.config.replies.rob.fail, remove);

	// Modify the balances based on if they fail or not, then send an embed with a random message containing their balance
	failed > 0.5 ? await blackMarket.add(interaction.user.id, add) : await blackMarket.subtract(interaction.user.id, remove);
	if (failed > 0.5) await blackMarket.subtract(target.id, add, "bank");

	const embed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user.displayAvatarURL())
		.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
		.setColor(failed > 0.5 ? 0x00FF00 : 0xFF0000);

	interaction.reply({ embeds: [embed] });
}