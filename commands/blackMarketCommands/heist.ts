import { Bot, blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {

		// Set variables
		const Vagan: Bot = interaction.bot;
		const config = Vagan.config.economy.crime;
		let fail: () => number = () => Math.random() * config.failRate;
		let add = command.tools.randomNumber(config.win.min, config.win.max);
		let remove = command.tools.randomNumber(config.fail.min, config.fail.max);
		const winReplies = command.tools.replaceReplies(Vagan.config.replies.crime.win, add);
		const failReplies = command.tools.replaceReplies(Vagan.config.replies.crime.fail, remove);

		interaction.respond("What item would you like to use?");
		interaction.channel.awaitMessages(m => m.author.id === interaction.author.id, { max: 1, time: 30000, errors: [ "time" ] })
			.then(async (collected) => {
				const user = await blackMarket.users.get(interaction.author.id);
				const item = collected.last()?.content.toLowerCase();
				const storedItem = await blackMarket.items.find("name", item);

				if (!storedItem) {
					return interaction.respond("That item doesn't exist.")
				} else if (!user.items.some((userItem: any) => userItem.name.toLowerCase() === item)) {
					return interaction.respond("You don't have that item.");
				} else if (!storedItem.payout || !storedItem.winRate) {
					return interaction.respond("That item can't be used for this.")
				} else if (storedItem.payout) {
					add += add * storedItem.payout;
					remove += remove * storedItem.payout;
				} else if (storedItem.winRate) { // @ts-expect-error
					fail = () => Math.random() * (config.failRate - storedItem.winRate);
				}
			})
			.catch(() => {
				return interaction.respond("You took too long.");
			});

		// Modify their balance based on if they fail or not, then send an embed with a random message containing their balance
		const failed: number = fail();
		failed > 0.5 ? await blackMarket.add(interaction.author.id, add) : await blackMarket.subtract(interaction.author.id, remove);

		const embed = new MessageEmbed()
			.setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
			.setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
			.setColor(failed > 0.5 ? "00FF00" : "FF0000");

		interaction.respond(undefined, { embed });
	}
};