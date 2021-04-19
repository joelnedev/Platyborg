import { blackMarket, Interaction } from "../../util/exports.js";
import { MessageEmbed, User } from "discord.js";
export default {
	async execute(interaction: Interaction, command: any) {
		
		// Gets current balance of the author
		const currentAmount: number = (await blackMarket.users.get(`${interaction.author?.id}`)).cash;
		
		// Gets the amount from the arg
		const transferAmount: number = command.args.amount;

		// @ts-expect-error | Gets the target from the arg
		const transferTarget: User = interaction.bot.users.cache.get(command.args.target);

		// Returns error if they don't have enough money
		if (transferAmount > currentAmount) {
			return interaction.respond(undefined, { embed: new MessageEmbed()
				.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(interaction.bot.config.replies.error[Math.floor(Math.random() * interaction.bot.config.replies.error.length)])
				.addField("Error", `You don't have enough cash. You currently have ${currentAmount}`) });
		}

		// Returns error if it's a negative amount of money
		if (transferAmount <= 0) {
			return interaction.respond(undefined, { embed: new MessageEmbed()
				.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(interaction.bot.config.replies.error[Math.floor(Math.random() * interaction.bot.config.replies.error.length)])
				.addField("Error", "You can't transfer a negative amount of money.") });
		}
		
		// Takes the money from the author
		await blackMarket.subtract(interaction.author?.id, transferAmount);
		
		// Gives the money to the target
		await blackMarket.add(transferTarget.id, transferAmount);

		// Success message
		interaction.respond(undefined, { embed: new MessageEmbed()
			.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
			.setColor("#00FF00")
			.setTitle("Transfer successful")
			.setDescription(`Successfully transferred ${transferAmount} to ${transferTarget}. Your current balance is ${(await blackMarket.users.get(interaction.author?.id)).cash}`) });
	}
};