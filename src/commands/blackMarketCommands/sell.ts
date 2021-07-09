import { blackMarket } from "../../util/exports.js";
import { Collection, CommandInteraction, GuildMember, Message, MessageEmbed, Snowflake } from "discord.js";
export default {
	async execute(interaction: CommandInteraction, command: any) {

		// Set variables
		const user = await blackMarket.users.get(interaction.user?.id);
		const target = await blackMarket.users.get(command.args.target?.id);
		const item = await blackMarket.items.find("name", command.args.item);
		const errorEmbed = new MessageEmbed()
			.setAuthor((interaction.member as GuildMember)?.displayName, interaction.user?.displayAvatarURL())
			.setColor(0xFF0000);

		if (!item) {
			errorEmbed.setDescription("That item doesn't exist.");
		} else if (!user.items.includes(item.name)) {
			errorEmbed.setDescription("You don't have that item.");
		} else if (target && (target.cash < item.cost)) {
			errorEmbed.setDescription("The user you're trying to sell to doesn't have enough money. Remember to withdraw — you can't do anything with money in your bank!");
		} else if (target) {
			await command.args.target.send(`${interaction.user?.tag} wants to sell ${item.name} to you for ${item.cost}. Do you accept the transaction? Respond with yes or no within 30 seconds.`);
			command.args.target.DMchannel.awaitMessages((m: Message) => (m.author.id === command.args.target.id) && (m.content.toLowerCase() === ("yes" || "no" || "y" || "n")), { max: 1, time: 30000, errors: [ "time" ] })
				.then(async (collected: Collection<Snowflake, Message>) => {
					const m = collected.last();
					switch (m?.content.toLowerCase()) {
						case "yes":
						case "y":
							// Let them know that it might take a moment
							m?.author.send("One moment...");
							interaction.reply(`${m?.author.tag} has accepted the transaction. One moment...`);

							// Edit items
							user.items.splice(user.items.findIndex((Item) => Item === item.id), 1);
							target.items.push(item.id);

							// Edit balance
							await blackMarket.add(interaction.user?.id, item.cost);
							await blackMarket.subtract(m?.author.id, item.cost);

							// Finish up
							interaction.reply("All done.");
							break;

						case "no":
						case "n":
							m?.author.send("Transaction was denied.");
							interaction.reply("The transaction was denied.");
							break;
					}
				})
				.catch(async () => {
					command.args.target.send("Time ran out, the transaction was denied.");
					interaction.reply("They didn't respond in time, the transaction was denied.");
				});
		} else {
			await interaction.reply(`I'll give you ${item.cost} for that. Sound good?`);
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.user?.id) && (m.content.toLowerCase() === ("yes" || "no" || "y" || "n")), { max: 1, time: 30000, errors: [ "time" ] })
				.then(async (collected) => {
					switch (collected.last()?.content.toLowerCase()) {
						case "yes":
						case "y":
							// Let them know that it might take a moment
							interaction.reply("One moment...");

							// Edit items
							user.items.splice(user.items.findIndex((Item) => Item === item.id), 1);

							// Edit balance
							await blackMarket.add(interaction.user?.id, item.cost);

							// Finish up
							interaction.reply("Thanks for the business.");
							break;

						case "no":
						case "n":
							interaction.reply("That's too bad, I had my eye on that...");
							break;
					}
				})
				.catch(async () => {
					interaction.reply("You took too long to respond.");
				});
		}

		// Send error if there was one
		if (errorEmbed.description) interaction.reply(undefined, { embed: errorEmbed });
	}
};