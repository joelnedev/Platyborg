import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed, User } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {
		
		// Gets current balance of the author
		const currentAmount: number = (await blackMarket.users.get(`${interaction.user?.id}`)).cash;
		
		// Gets the amount from the arg
		const transferAmount: number = command.args.amount;

		// @ts-expect-error | Gets the target from the arg
		const transferTarget: User = Vagan.users.cache.get(command.args.target);

		// Returns error if they don't have enough money
		if (transferAmount > currentAmount) {
			return interaction.reply({ embeds: [new MessageEmbed()
				.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
				.addField("Error", `You don't have enough cash. You currently have ${currentAmount}`)] });
		}

		// Returns error if it's a negative amount of money
		if (transferAmount <= 0) {
			return interaction.reply({ embeds: [new MessageEmbed()
				.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
				.setColor("#FF0000")
				.setTitle("Invalid amount 🚨")
				.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
				.addField("Error", "You can't transfer a negative amount of money.")] });
		}
		
		// Takes the money from the author
		await blackMarket.subtract(interaction.user?.id, transferAmount);
		
		// Gives the money to the target
		await blackMarket.add(transferTarget.id, transferAmount);

		// Success message
		interaction.reply({ embeds: [new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
			.setColor("#00FF00")
			.setTitle("Transfer successful")
			.setDescription(`Successfully transferred ${transferAmount} to ${transferTarget}. Your current balance is ${(await blackMarket.users.get(interaction.user?.id)).cash}`)] });
	}
};