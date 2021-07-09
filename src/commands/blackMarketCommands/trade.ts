import { blackMarket, Vagan } from "../../util/exports.js";
import { Collection, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake, User } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const user = await blackMarket.users.get(interaction.user?.id);
		const target = await blackMarket.users.get(command.args.target?.id);
		const item = await blackMarket.items.find("name", command.args.item);
		const targetItem: any = {};
		const errorEmbed = new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
			.setColor(0xFF0000);

		interaction.reply("What item would you like in return?");
		interaction.channel?.awaitMessages( ({ filter: (m => m.author.id === command.args.target.id), max: 1, time: 30000, errors: [ "time" ] }))
			.then(async (collected) => {
				targetItem.h = await blackMarket.items.find("name", collected.last()?.content);
			});

		if (!item) {
			errorEmbed.setDescription("That item doesn't exist.");
		} else if (!user.items.includes(item.name)) {
			errorEmbed.setDescription("You don't have that item.");
		} else if (!target.items.includes(targetItem.h.id)) {
			errorEmbed.setDescription("The user you're trying to sell to doesn't have the item you're looking for.");
		} else {
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomID("trade-accept")
					.setEmoji("819637115154858014")
					.setLabel("Accept")
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomID("trade-decline")
					.setEmoji("819647169036156928")
					.setLabel("Decline")
					.setStyle("DANGER")
			);
			const m = (await (await Vagan.users.fetch(user.id)).dmChannel?.send({ content: `${interaction.user?.tag} wants to trade you ${item.name} for ${targetItem.h.name}. Do you accept the transaction? Accept or decline within 30 seconds.`, components: [buttons] }));
			m?.awaitMessageComponentInteraction({ filter: int => int.customID === ("trade-accept" || "trade-decline"), time: 30000 })
				.then(int => {
					switch (int.customID) {
						case "trade-accept":
							// Disable the buttons
							
							
							// Let them know that it might take a moment
							int.followUp("One moment...");
							interaction.followUp(`${int.user.tag} has accepted the transaction. One moment...`);

							// Edit items
							user.items.splice(user.items.findIndex((Item) => Item === item.id), 1);
							target.items.push(item.id);

							user.items.splice(user.items.findIndex((Item) => Item === targetItem.h.id), 1);
							target.items.push(targetItem.h.id);

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
				})
				.finally(() => {

				});
		}

		// Send error if there was one
		if (errorEmbed.description) interaction.reply({ embeds: [errorEmbed] });
	}
};