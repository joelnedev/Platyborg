import { blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {

		// Set variables
		const user = await blackMarket.add(command.args.target, 0);
		const embed = new MessageEmbed()
			.setAuthor(interaction.bot.users.cache.get(command.args.target.displayAvatarURL()), command.args.target.displayAvatarURL())
			.addField("Cash", `${user.cash}`)
			.addField("Bank", `${user.bank}`)
			.addField("Net Worth", `${user.cash + user.bank}`);

		// Send info
		interaction.respond(undefined, { embed });
	}
};