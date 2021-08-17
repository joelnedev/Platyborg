import { blackMarket, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
export const execute = async (interaction: CommandInteraction) => {

	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);

	// Gets current balance of the author
	const currentAmount = (await blackMarket.users.get(`${interaction.user?.id}`)).cash;

	// Gets the amount from the arg
	const transferAmount = interaction.options.getNumber("amount", true);

	// Gets the target from the arg
	const transferTarget = await Vagan.users.fetch(interaction.options.getUser("user", true).id);

	const embed = new MessageEmbed()
		.setAuthor(member.displayName, interaction.user?.displayAvatarURL())
		.setColor(0xFF0000)
		.setTitle("Invalid amount 🚨")
		.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)]);

	// Returns error if they don't have enough money
	if (transferAmount > currentAmount) return interaction.reply({ embeds: [ embed.addField("Error", `You don't have enough cash. You currently have ${currentAmount}`) ] });

	// Returns error if it's a negative amount of money
	if (transferAmount <= 0) return interaction.reply({ embeds: [ embed.addField("Error", "You can't transfer a negative amount of money.") ] });

	// Takes the money from the author
	await blackMarket.subtract(interaction.user?.id, transferAmount);

	// Gives the money to the target
	await blackMarket.add(transferTarget.id, transferAmount);

	// Success message
	interaction.reply({ embeds: [ embed
		.setColor(0x00FF00)
		.setTitle("Transfer successful")
		.setDescription(`Successfully transferred ${transferAmount} to ${transferTarget}. Your current balance is ${(await blackMarket.users.get(interaction.user?.id)).cash}`) ] });
}