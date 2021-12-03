import { blackMarket, randomNumber, replaceReplies, platyborg } from "../../util/index.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction, command: any) => {

	// Set variables
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const config = platyborg.config.economy.slut;
	const failed = Math.random() * config.failRate;
	const add = randomNumber(config.win.min, config.win.max);
	const remove = randomNumber(config.fail.min, config.fail.max);
	const winReplies = await replaceReplies(platyborg.config.replies.slut.win, add);
	const failReplies = await replaceReplies(platyborg.config.replies.slut.fail, remove);

	// Modify their balance based on if they fail or not, then send an embed with a random message containing their balance
	failed > 0.5 ? await blackMarket.add(interaction.user?.id, add) : await blackMarket.subtract(interaction.user?.id, remove);

	const embed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user?.displayAvatarURL())
		.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
		.setColor(failed > 0.5 ? 0x00FF00 : 0xFF0000);

	interaction.reply({ embeds: [ embed ] });
}