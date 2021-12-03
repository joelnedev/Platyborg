import { blackMarket, randomNumber, replaceReplies, platyborg } from "../../util/index.js";
import { CommandInteraction, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {
	// Set variables
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const config = platyborg.config.economy.work;
	const add = randomNumber(config.win.min, config.win.max);
	const replies = await replaceReplies(platyborg.config.replies.work, add);

	// Modify their balance, then send an embed with a random message containing their balance
	await blackMarket.add(interaction.user.id, add, "cash");
	const embed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user?.displayAvatarURL())
		.setDescription(replies[Math.floor(Math.random() * replies.length)])
		.setColor(0x00FF00);
	interaction.reply({ embeds: [ embed ] });
}