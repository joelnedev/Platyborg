import { blackMarket, randomNumber, replaceReplies, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export default {
	async execute(interaction: CommandInteraction) {

		// Set variables
		const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
		const config = Vagan.config.economy.work;
		const add = randomNumber(config.win.min, config.win.max);
		const replies = replaceReplies(Vagan.config.replies.work, add);

		// Modify their balance, then send an embed with a random message containing their balance
		await blackMarket.add(member.id, add, "cash");
		const embed = new MessageEmbed()
			.setAuthor(member.displayName, interaction.user?.displayAvatarURL())
			.setDescription(replies[Math.floor(Math.random() * replies.length)])
			.setColor(0x00FF00);
		interaction.reply({ embeds: [ embed ] });
	}
};