import { blackMarket, Vagan } from "../util/exports.js";
import { Collection, CommandInteraction, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import { restart } from "pm2";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);

	// Only allows god mode users to use the command (and sends non god mode users a polite, informative message about why they cannot execute it)
	if (!Vagan.hideout.godModeUsers.includes(member.user.id) || member.user.id !== "spoons id") {
		const fail = [ "nawwyaintfr", "noyoucannotpossiblyserious", "trolort", "nah", "fail", "failure", "you arent the boss of me >:(", "yo mama", "roflcopter", "no", "stop", "die", "i am going to cry" ];
		return interaction.reply({ content: fail[Math.floor(Math.random() * fail.length)], ephemeral: true });
	}

	// Declares a couple objects: tempStorage for temporary storage and func to make the switch more legible
	const tempStorage: any = {};
	const func = (interaction.options.find(arg => arg.name === "function")?.value as string)?.toLowerCase();

	// Runs different functions based on specification
	switch (func) {
		case "reboot":
			await interaction.reply({ content: "rebooting :grin::+1:", ephemeral: true });
			tempStorage.func = "reboot";
			break;

		case "additem":
			tempStorage.addItem = {
				name: interaction.options.find(arg => arg.name === "arg0")?.value
			};

			await interaction.reply(`ok sp**on (or other ~~gender~~ admin). set more properties for ${tempStorage.addItem.itemName}`);

			await interaction.reply("give me a 10 character item id. this is basically shorthand for the name, it's used for storage and isnt revealed to the end user. dont put a space though. (you have 60 seconds to respond)");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => m.author.id === member.user.id, max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected: Collection<string, Message>) => {
					await interaction.reply(`setting \`id\` to \`${collected.last()?.content}\``)
					tempStorage.id = collected.last()?.content;
			})
				.catch(async () => await interaction.reply("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.id) return;

			await interaction.reply("next is description. give a sentence or two explaining the item. obviously, it will be revealed to the end user. you get 60 seconds again.");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => m.author.id === member.user.id, max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`description\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.description = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.addItem.description) return;

			await interaction.reply("how much does the item cost? give me a valid number equal to or greater than 1 or you will ruin every command that uses this item. 1 minute instead of 60 seconds this time, starting now.");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => m.author.id === member.user.id, max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`cost\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.cost = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.addItem.cost) return;

			await interaction.reply("should the item be shown in users' inventory?!?!?! only say yes if this item should be a heist powerup or vanity thing like plasmablade (more item functionality coming soon), respond with 'true' or 'false' within a minute.");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => m.author.id === member.user.id, max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`invShow\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.invShow = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long. database hasnt been modified yet, run the command again"));
				if (!tempStorage.addItem.invShow) return;

			await interaction.reply("next properties are optional. if you dont want to set one, respond with 'none' or wait for time to expire");

			await interaction.reply("set the required items if this is a crafted item. separate item names by spaces (if the item name has a space, leave it out and let juh know)");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => (m.author.id === member.user.id) && (m.content.toLowerCase() !== "none"), max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`requiredItems\` to \`${collected.last()?.content}\``);
					const requiredItems: string[] = [];
					collected.last()?.content.split(" ").forEach(async (item: string) => requiredItems.push((await blackMarket.items.find("name", item)).id));
					tempStorage.addItem.requiredItems = requiredItems;
				})
				.catch(async () => await interaction.reply("you took too long or said `none`. property has not been set"));

			await interaction.reply("what should Vagan say when the user buys the item? obviously maximum is 2000 characters but why would you do that");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => (m.author.id === member.user.id) && (m.content.toLowerCase() !== "none"), max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`gainMessage\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.gainMessage = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long or said `none`. property has not been set"));

			await interaction.reply("what role should users get when they buy the item? send a role ID (not the name, not a ping, but the id) or the bot will go nuts");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => (m.author.id === member.user.id) && (m.content.toLowerCase() !== "none"), max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`roleGain\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.roleGain = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long or said `none`. property has not been set"));

			await interaction.reply("if this is a heist powerup, should it give a payout boost? for example, if you send `1.5`, using this item in a heist will give/take 50% more money.");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => (m.author.id === member.user.id) && (m.content.toLowerCase() !== "none"), max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`payout\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.payout = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long or said `none`. property has not been set"));

			await interaction.reply("if this is a heist powerup, should it give a higher chance of winning? this will be subtracted from the crime fail rate of 45%. for example, if you send `10`, the chance of losing will be 35% when used in a heist.");
			(interaction.channel as TextChannel).awaitMessages({ filter: m => (m.author.id === member.user.id) && (m.content.toLowerCase() !== "none"), max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.reply(`setting \`payout\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.payout = collected.last()?.content;
				})
				.catch(async () => await interaction.reply("you took too long or said `none`. property has not been set"));

			try {
				(async () => {
					if (blackMarket.items.has(tempStorage.id) || blackMarket.items.find("name", tempStorage.additem.name)) {
						throw new Error("Item already exists");
					} else {
						await blackMarket.items.set(tempStorage.id, { id: tempStorage.id, ...tempStorage.addItem });
						await Vagan.hideout.logChannel.send(`${member.user.tag} created item "${tempStorage.addItem.name}":`);
						Vagan.emit("debug", `${member.user.tag} created item "${tempStorage.addItem.name}":`);
						const embed = new MessageEmbed();
						for (const key in tempStorage.addItem) {
							embed.addField(key, tempStorage.addItem[key]);
							Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
						}
						Vagan.hideout.logChannel.send({ embeds: [embed] });
					}
				})();
			} catch (err) {
				Vagan.handleError(err, interaction);
				await Vagan.hideout.logChannel.send(`${member.user.tag} tried to create item "${tempStorage.addItem.name}":`);
				Vagan.emit("debug", `${member.user.tag} tried to create item "${tempStorage.addItem.name}":`);
				const embed = new MessageEmbed();
				for (const key in tempStorage.addItem) {
					embed.addField(key, tempStorage.addItem[key]);
					Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
				}
				await Vagan.hideout.logChannel.send({ embeds: [embed] });
			} finally {
				interaction.reply("Everything is finished. You may have received an error, in which case you should wait for jojo bot to get back to you before trying again.");
			}

			break;

		default:
			return interaction.reply({ content: "Not a function :face_with_raised_eyebrow:", ephemeral: true });
	}

	const sendMe = new Array();
	sendMe.push(`${member.user.tag} used root function \`${tempStorage.func}\``);
	if (tempStorage.arg0) {
		sendMe.push(`Arg0: ${tempStorage.arg0}`);
	}
	await Vagan.hideout.logChannel.send(sendMe.join("\n"));
	
	if (tempStorage.func === "reboot") {
		restart("all", () => console.log(`Vagan restarted by ${member.user.tag}`));
	}
}
command.help = {
	name: "root",
	description: "A number of functions that can only be run by god mode users", 
	options: [
		{
			name: "function",
			description: "Function to run",
			type: 3,
			required: true
		},
		{
			name: "arg0",
			description: "in case the function needs args",
			type: 3,
			required: false
		}
	]
}
