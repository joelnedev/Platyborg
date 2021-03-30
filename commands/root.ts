import { blackMarket, GlobalCommand, Interaction } from "../util/exports.js";
import { Message, MessageEmbed } from "discord.js";
import { restart } from "pm2";
export default new GlobalCommand({
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
	],
	async execute(interaction: Interaction) {

		const Vagan = interaction.bot;
		
		// Only allows god mode users to use the command (and sends non god mode users a polite, informative message about why they cannot execute it)
		if (!Vagan.hideout.godModeUsers.includes(interaction.author.id) || interaction.author.id !== "spoons id") {
			const fail = [ "nawwyaintfr", "noyoucannotpossiblyserious", "trolort", "nah", "fail", "failure", "you arent the boss of me >:(((((", "yo mama", "roflcopter", "no", "stop", "die", "i am going to cry" ];
			return interaction.respond(fail[Math.floor(Math.random() * fail.length)], { ephemeral: true });
		}

		// Declares a couple objects. tempStorage for temporary storage and func because you can't use await in a switch.
		const tempStorage: any = {};
		const func = await interaction.args.find((arg: any) => arg.name === "function")?.value.toLowerCase();

		// Runs different functions based on specification
		switch (func) {
		case "reboot":
			await interaction.respond("rebooting :grin::+1:", { ephemeral: true });
			tempStorage.func = "reboot";
			break;

		case "eval":
			try {
				const code: string = interaction.args.find((arg: any) => arg.name === "arg0")?.value;
				let evaled = eval(code);
				tempStorage.arg0 = code;
				if (code.includes("token")) {
					tempStorage.arg0 = "tried to get the bot token";
					return interaction.respond("no.", { ephemeral: true });
				}

				if (typeof evaled !== "string")
					evaled = require("util").inspect(evaled);
				await interaction.respond(`\`\`\`xl\n${evaled}\n\`\`\``, { ephemeral: true});
			} catch (err) {
				await interaction.respond(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``, { ephemeral: true });
			}
			break;

		case "additem":
			tempStorage.addItem = {
				name: interaction.args.find((arg: any) => arg.name === "arg0")?.value
			};

			await interaction.respond(`ok sp**on. set more properties for ${tempStorage.addItem.itemName}`);

			await interaction.respond("give me a 10 character item id. this is basically shorthand for the name, it's used for storage and isnt revealed to the end user. dont put a space though. (you have 60 seconds to respond)");
			interaction.channel.awaitMessages((m: Message) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`id\` to \`${collected.last()?.content}\``)
					tempStorage.id = collected.last()?.content;
			})
				.catch(async () => await interaction.respond("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.id) return;

			await interaction.respond("next is description. give a sentence or two explaining the item. obviously, it will be revealed to the end user. you get 60 seconds again.");
			interaction.channel.awaitMessages((m: Message) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`description\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.description = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.addItem.description) return;

			await interaction.respond("how much does the item cost? give me a valid number equal to or greater than 1 or you will ruin every command that uses this item. 1 minute instead of 60 seconds this time, starting now.");
			interaction.channel.awaitMessages((m: Message) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`cost\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.cost = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long. database hasnt been modified yet, run the command again"));
			if (!tempStorage.addItem.cost) return;

			await interaction.respond("should the item be shown in users' inventory?!?!?! only say yes if this item should be a heist powerup or vanity thing like plasmablade (more item functionality coming soon), respond with 'true' or 'false' within a minute.");
			interaction.channel.awaitMessages((m: Message) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`invShow\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.invShow = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long. database hasnt been modified yet, run the command again"));
				if (!tempStorage.addItem.invShow) return;

			await interaction.respond("next properties are optional. if you dont want to set one, respond with 'none' or wait for time to expire");

			await interaction.respond("set the required items if this is a crafted item. separate item names by spaces (if the item name has a space, leave it out and let juh know)");
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`requiredItems\` to \`${collected.last()?.content}\``);
					const requiredItems: string[] = [];
					collected.last()?.content.split(" ").forEach(async item => requiredItems.push((await blackMarket.items.find("name", item)).id));
					tempStorage.addItem.requiredItems = requiredItems;
				})
				.catch(async () => await interaction.respond("you took too long or said `none`. property has not been set"));

			await interaction.respond("what should Vagan say when the user buys the item? obviously maximum is 2000 characters but why would you do that");
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`gainMessage\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.gainMessage = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long or said `none`. property has not been set"));

			await interaction.respond("what role should users get when they buy the item? send a role ID (not the name, not a ping, but the id) or the bot will go nuts");
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`roleGain\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.roleGain = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long or said `none`. property has not been set"));

			await interaction.respond("if this is a heist powerup, should it give a payout boost? for example, if you send `1.5`, using this item in a heist will give/take 50% more money.");
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`payout\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.payout = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long or said `none`. property has not been set"));

			await interaction.respond("if this is a heist powerup, should it give a higher chance of winning? this will be subtracted from the crime fail rate of 45%. for example, if you send `10`, the chance of losing will be 35% when used in a heist.");
			interaction.channel.awaitMessages((m: Message) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: [ "time" ] })
				.then(async (collected) => {
					await interaction.respond(`setting \`payout\` to \`${collected.last()?.content}\``);
					tempStorage.addItem.payout = collected.last()?.content;
				})
				.catch(async () => await interaction.respond("you took too long or said `none`. property has not been set"));

			try {
				(async () => {
					if (blackMarket.items.has(tempStorage.id) || blackMarket.items.find("name", tempStorage.additem.name)) {
						throw new Error("Item already exists");
					} else {
						await blackMarket.items.set(tempStorage.id, { id: tempStorage.id, ...tempStorage.addItem });
						await Vagan.hideout.logChannel.send(`${interaction.author.tag} created item "${tempStorage.addItem.name}":`);
						Vagan.emit("debug", `${interaction.author.tag} created item "${tempStorage.addItem.name}":`);
						const embed = new MessageEmbed();
						for (const key in tempStorage.addItem) {
							embed.addField(key, tempStorage.addItem[key]);
							Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
						}
						Vagan.hideout.logChannel.send(embed);
					}
				})();
			} catch (err) {
				Vagan.handleError(err, interaction);
				await Vagan.hideout.logChannel.send(`${interaction.author.tag} tried to create item "${tempStorage.addItem.name}":`);
				Vagan.emit("debug", `${interaction.author.tag} tried to create item "${tempStorage.addItem.name}":`);
				const embed = new MessageEmbed();
				for (const key in tempStorage.addItem) {
					embed.addField(key, tempStorage.addItem[key]);
					Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
				}
				await Vagan.hideout.logChannel.send(embed);
			} finally {
				interaction.respond("Everything is finished. You may have received an error, in which case you should wait for jojo bot to get back to you before trying again.");
			}

			break;

		default:
			return interaction.respond("Not a function :face_with_raised_eyebrow:", { ephemeral: true });
		}

		const sendMe = new Array();
		sendMe.push(`${interaction.author.tag} used root function \`${tempStorage.func}\``);
		if (tempStorage.arg0) {
			sendMe.push(`Arg0: ${tempStorage.arg0}`);
		}
		await Vagan.hideout.logChannel.send(sendMe.join("\n"));
		
		if (tempStorage.func === "reboot") {
			restart("all", () => console.log(`Vagan restarted by ${interaction.author.tag}`));
		}
	},
});