import { blackMarket, platyborg } from "../../util/index.js";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageButtonStyle, MessageEmbed } from "discord.js";
import { ButtonStyle } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {

	// Set variables
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const user = await blackMarket.getUser(interaction.user?.id);
	const target = interaction.options.get("user") ? await blackMarket.getUser(interaction.options.getUser("user", true).id) : undefined;
	const item = await blackMarket.items.find("name", interaction.options.getString("item", true));
	const errorEmbed = new MessageEmbed()
		.setAuthor(member.nickname ?? interaction.user.username, interaction.user?.displayAvatarURL())
		.setColor(0xFF0000);

	if (!item) {
		errorEmbed.setDescription("That item doesn't exist.");
	} else if (!user.items.includes(item.name)) {
		errorEmbed.setDescription("You don't have that item.");
	} else if (target && (target.cash < item.cost)) {
		errorEmbed.setDescription("The user you're trying to sell to doesn't have enough money. Remember to withdraw — you can't do anything with money in your bank!");
	} else if (target) {
		const accept = new MessageButton()
				.setCustomId("sell-accept")
				.setEmoji("819637115154858014")
				.setLabel("Accept")
				.setStyle(ButtonStyle.Success as number);
		const decline = new MessageButton()
				.setCustomId("sell-decline")
				.setEmoji("819647169036156928")
				.setLabel("Decline")
				.setStyle(ButtonStyle.Danger as number);
		const m = (await (await platyborg.users.fetch(user.id)).dmChannel?.send({ content: `${interaction.user?.tag} wants to sell ${item.name} to you for ${item.cost}. Do you accept the transaction? Accept or decline within 30 seconds.`, components: [ new MessageActionRow().addComponents(accept, decline) ] }));
		m?.awaitMessageComponent({ filter: int => int.customId === ("sell-accept" || "sell-decline"), time: 30000 })
			.then(async int => {
				switch (int.customId) {
					case "sell-accept":
						// Disable the buttons
						int.update({ components: [ new MessageActionRow().addComponents(accept.setDisabled(true), decline.setDisabled(true)) ]});
						
						// Let them know that it might take a moment
						int.followUp("One moment...");
						interaction.followUp(`${int.user.tag} has accepted the transaction. One moment...`);

						// Edit items
						await blackMarket.removeItem(user.id, item.id);
						await blackMarket.addItem(target.id, item.id);

						// Edit balance
						await blackMarket.add(user.id, item.cost);
						await blackMarket.subtract(target.id, item.cost);

						// Finish up
						int.followUp("Transaction complete.")
						interaction.followUp("Transaction complete.");
						break;

					case "sell-decline":
						int.reply("Transaction was denied.");
						interaction.followUp("The transaction was denied.");
						break;
				}
			})
			.catch(async () => {
				(await platyborg.users.fetch(user.id)).dmChannel?.send("Time ran out, the transaction was denied.");
				interaction.reply("They didn't respond in time, the transaction was denied.");
			});
	} else {
		await interaction.reply(`I'll give you ${item.cost} for that. Sound good?`);
		interaction.channel?.awaitMessageComponent({ filter: int => (int.user.id === interaction.user?.id) && (int.customId === ("sell-platyborg-accept" || "sell-platyborg-decline")), time: 30000 })
			.then(async int => {
				switch (int.customId) {
					case "sell-platyborg-accept":
						// Let them know that it might take a moment
						interaction.reply("One moment...");

						// Edit items
						await blackMarket.removeItem(user.id, item.id);

						// Edit balance
						await blackMarket.add(user.id, item.cost);

						// Finish up
						interaction.reply("Thanks for the business.");
						break;

					case "sell-platyborg-decline":
						interaction.reply("That's too bad, I had my eye on that...");
						break;
				}
			})
			.catch(async () => {
				interaction.reply("You took too long to respond.");
			});
	}

	// Send error if there was one
	if (errorEmbed.description) interaction.reply({ embeds: [ errorEmbed ] });
}