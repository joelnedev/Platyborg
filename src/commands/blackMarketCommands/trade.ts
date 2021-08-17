import { blackMarket, item, Vagan } from "../../util/exports.js";
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageButtonStyle, MessageEmbed } from "discord.js";
import { ButtonStyle } from "discord-api-types";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);
		const user = await blackMarket.users.get(interaction.user?.id);
		const target = await blackMarket.users.get(command.args.target?.id);
		const item = await blackMarket.items.find("name", command.args.item);
		let targetItem: item;
		const errorEmbed = new MessageEmbed()
			.setAuthor(member.displayName, interaction.user?.displayAvatarURL())
			.setColor(0xFF0000);

		interaction.reply("What item would you like in return?");
		interaction.channel?.awaitMessages( ({ filter: (m => m.author.id === command.args.target.id), max: 1, time: 30000, errors: [ "time" ] }))
			.then(async (collected) => {
				targetItem = await blackMarket.items.find("name", collected.last()?.content);
			});

		if (!item) {
			errorEmbed.setDescription("That item doesn't exist.");
		} else if (!user.items.includes(item.name)) {
			errorEmbed.setDescription("You don't have that item.");
		} else if (!target.items.includes(targetItem!.id)) {
			errorEmbed.setDescription("The user you're trying to sell to doesn't have the item you're looking for.");
		} else {
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("trade-accept")
					.setEmoji("819637115154858014")
					.setLabel("Accept")
					.setStyle(ButtonStyle.Success as unknown as MessageButtonStyle),
				new MessageButton()
					.setCustomId("trade-decline")
					.setEmoji("819647169036156928")
					.setLabel("Decline")
					.setStyle(ButtonStyle.Danger as unknown as MessageButtonStyle)
			);
			const m = (await (await Vagan.users.fetch(user.id)).dmChannel?.send({ content: `${interaction.user?.tag} wants to trade you ${item.name} for ${targetItem!.name}. Do you accept the transaction? Accept or decline within 30 seconds.`, components: [buttons] }));
			m?.awaitMessageComponent({ filter: int => int.customId === ("trade-accept" || "trade-decline"), time: 30000 })
				.then(int => {
					switch (int.customId) {
						case "trade-accept":
							// Disable the buttons
							const disabledButtons = new MessageActionRow().addComponents(
								new MessageButton()
									.setCustomId("trade-accept")
									.setEmoji("819637115154858014")
									.setLabel("Accept")
									.setStyle(ButtonStyle.Success as unknown as MessageButtonStyle)
									.setDisabled(true),
								new MessageButton()
									.setCustomId("trade-decline")
									.setEmoji("819647169036156928")
									.setLabel("Decline")
									.setStyle(ButtonStyle.Danger as unknown as MessageButtonStyle)
									.setDisabled(true)
							);
							int.update({ components: [ disabledButtons ]});
							
							// Let them know that it might take a moment
							int.followUp("One moment...");
							interaction.followUp(`${int.user.tag} has accepted the transaction. One moment...`);

							// Edit items
							blackMarket.addItem(user.id, targetItem.id);
							blackMarket.removeItem(target.id, targetItem.id);

							blackMarket.addItem(target.id, item.id);
							blackMarket.removeItem(user.id, item.id);

							// Finish up
							int.followUp("Transaction complete.")
							interaction.followUp("Transaction complete.");
							break;

						case "trade-accept":
							int.reply("Transaction was denied.");
							interaction.followUp("The transaction was denied.");
							break;
					}
				})
				.catch(async () => {
					(await Vagan.users.fetch(user.id)).dmChannel?.send("Time ran out, the transaction was denied.");
					interaction.reply("They didn't respond in time, the transaction was denied.");
				});
		}

		// Send error if there was one
		if (errorEmbed.description) interaction.reply({ embeds: [errorEmbed] });
	}
};