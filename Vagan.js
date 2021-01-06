/* eslint-disable no-case-declarations */

/*
For the sake of transparency, I'm gonna add comments explaining almost every line (and do my best not to get too technical so 8 year olds like Spoons can understand :trolololo:). 
I want to make sure that the admins' trust in me/Vagan is rightfully placed. 
If any further elaboration/explanation is needed, dm me (you probably already know, but it's JuhJuhButt#7818) or file an issue on the GitHub.
This bot is made mostly for the memes, but it also has real functions such as posting to #showcase (similar to how #suggestions works) and a unb-style economy.
*/

// This block sets important things needed throughout the script.

// Of course, I need to import the Discord.js library to use it. I'll be calling it via "Discord".
// eslint-disable-next-line no-undef
const Discord = require("discord.js");

// For my bot to have a user, it needs a client similar to how you need a mobile or desktop client to get to Discord. Most people call it using "client", 
// but I feel that "bot" is more concise and transparent.
const bot = new Discord.Client();

// Every bot needs a prefix, this is pretty self-explanatory.
// eslint-disable-next-line no-undef
const { prefix, token, godModeUsers } = require("./info/config.json");

// Get random reply messages to use later.
// eslint-disable-next-line no-undef
const { errorReplies } = require("./info/randomMessages.json");

// Allows me to call Users, CurrencyShop, my database program, and a currency cache later in the file.
// eslint-disable-next-line no-undef
/* const { Users, CurrencyShop } = require("./dbObjects");
// eslint-disable-next-line no-undef
const { Op } = require("sequelize");
const currency = new Discord.Collection();
*/

// Messing around with slash commands rn and don't feel like doing it through http requests
// eslint-disable-next-line no-undef
const interactions = require("discord-slash-commands-client"); 
// eslint-disable-next-line no-unused-vars
const client = new interactions.Client(token, "766295959700897813");



// Finds files in ./commands that end in .js, then add it to the bot.commands section.
// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
bot.commands = new Discord.Collection();
for (const file of commandFiles) {
	// eslint-disable-next-line no-undef
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"));
client.commands = new Discord.Collection();
for (const file of slashFiles) {
	// eslint-disable-next-line no-undef
	const slash = require(`./slash/${file}`);
	client.commands.set(slash.name, slash);
}

// Sets helpful methods to add money to and get the balance of a specified user.
/* Reflect.defineProperty(currency, "add", {
	// eslint-disable-next-line func-name-matching 
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, "getBalance", {
	// eslint-disable-next-line func-name-matching
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});
*/

// This code block runs only once on the event "ready", which triggers once my bot has logged in and is ready to interact with Discord.
bot.once("ready", async () => {

	// This sets the bot's status to "Playing with guns | amazing pfp by talk14#5057".
	bot.user.setActivity("with guns | amazing pfp by talk14#5057");
	
	// In the terminal from which my bot is launched, it will log "I'm in."
	// eslint-disable-next-line no-undef
	console.log("I'm in.");

	// This code block syncs my currency cache collection with my persistant database.
	/* const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	*/
	for (const file of slashFiles) {
		// eslint-disable-next-line no-undef
		const slash = require(`./slash/${file}`);
		client.interactions
			.createCommand({
				name: slash.name,
				description: slash.description,
			})
			// eslint-disable-next-line no-undef
			.then(console.log)
			// eslint-disable-next-line no-undef
			.catch(console.error);
		for (const alias of slash.aliases) {
			client.interactions
				.createCommand({
					name: alias,
					description: slash.description,
				})
			// eslint-disable-next-line no-undef
				.then(console.log)
			// eslint-disable-next-line no-undef
				.catch(console.error);
		}
		
	}
});

// This code block runs every time a reaction is added to a message, and passes the reaction object for usage inside the callback script.
bot.on("messageReactionAdd", reaction => {
	if (!reaction.message.channel.id === "showcaseid" || !reaction.message.author.id === bot.user.id) return;
});

bot.on("interactionCreate", async interaction => {

	// This slices messages into arguments and ignores multiple spaces in a row.
	const args = interaction.content.slice(prefix.length).split(/ +/);

	// It then indexes the commands from the ./slash folder.
	const command = client.commands.get(interaction.name)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.name));

	// If a command requires arguments but none are provided, let them know.
	if (command.args === true && !args.length) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(interaction.member.nickname, interaction.author.avatarURL())
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("Error", "Insufficient information", true);

		// If the command has defined usage, provide it to the user.
		if (command.usage) {
			embed.addField("Usage:", prefix + command.name + command.usage);
		}

		// Send the embed and handle an error if one occurs.
		interaction.channel.send(embed).catch((error) => {
			const embed = new Discord.MessageEmbed()
				.setTitle("Error 🚨")
				.setColor("#ff0000")
				.setAuthor(interaction.member.nickname, interaction.author.avatarURL())
				.addField("Error", "An error has occurred.");
			interaction.channel.send(embed
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
			bot.users.cache.get("268138992606773248").send(embed.addField("Link:", interaction.url).addField("Error:", error));
		});
		return;
	}

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try {
		// eslint-disable-next-line no-undef
		command.execute(interaction, args, Discord, currency, CurrencyShop, Users, Op, prefix, godModeUsers, errorReplies);
	} catch (error) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(interaction.member.nickname, interaction.author.avatarURL())
			.addField("Error", "An error has occurred.");
		interaction.channel.send(embed
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
		bot.users.cache.get("268138992606773248").send(embed.addField("Link:", interaction.url).addField("Error:", error));
	}
	
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
bot.on("message", async message => {

	// These lines initiate the sets "talkedRecently" and "showcaseCooldown". It isn't perfect, but it is a funcioning cooldown system.
	const talkedRecently = new Set;
	const showcaseCooldown = new Set;

	// This block sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (["egis", "egis"].some(egis => message.content.toLowerCase().includes(egis)) && !message.channel.id === "712991588376117308" && message.author.id !== bot.user.id) {
		message.channel.send("egis");
	}

	// Besides messages containing "egis", Vagan will ignore messages that don't start with the prefix, are from other bots, or are sent via dm.
	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return;

	// This slices messages into arguments and ignores multiple spaces in a row.
	const args = message.content.slice(prefix.length).split(/ +/);

	// This takes the first argument out of the array and sets it as the command name.
	const commandName = args.shift().toLowerCase();

	// It then indexes the commands from the ./commands folder.
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	
	// If a user used a command within 5 seconds, dm them and tell them to shut the up.
	if (talkedRecently.has(message.author.id)) {
		message.author.send("Stop spamming :face_with_symbols_over_mouth:");
		return;
	}

	// After exiting if they've talked recently, add them to the "talkedRecently" array for 5000 ms (5 seconds)
	talkedRecently.add(message.author.id);
	// eslint-disable-next-line no-undef
	setTimeout(() => {
		talkedRecently.delete(message.author.id);
	}, 5000);

	// If a user has used showcase recently, dm them with an explanation about the cooldown.
	if (showcaseCooldown.has(message.author.id)) {
		message.author.send("You can post one showcase every 5 minutes. To discuss a showcase, use the appropriate channel (or sopones wil bane you)");
		return;
	}

	// Secret eval command
	// I'm locking it to myself instead of godmode users cause this is fucking dangerous (gives them access to my whole server which is currently my school laptop)

	const clean = text => {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	};
	
	if (message.content.startsWith(prefix + "eval")) {
		if(message.author.id !== "268138992606773248") return;
		try {
			const code = args.join(" ");
			let evaled = eval(code);
	
			if (typeof evaled !== "string")
				// eslint-disable-next-line no-undef
				evaled = require("util").inspect(evaled);
	
			return message.channel.send(clean(evaled), {code:"xl"});
		} catch (err) {
			return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}

	// If the comand doesn't exist, let the user know
	if (!command) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("Error", "Command not found/invalid syntax", true);
		message.channel.send(embed);
	}

	// If a command requires arguments but none are provided, let them know.
	if (command.args === true && !args.length) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("Error", "Insufficient information", true);

		// If the command has defined usage, provide it to the user.
		if (command.usage) {
			embed.addField("Usage:", prefix + command.name + command.usage);
		}

		// Send the embed and handle an error if one occurs.
		message.channel.send(embed).catch((error) => {
			const embed = new Discord.MessageEmbed()
				.setTitle("Error 🚨")
				.setColor("#ff0000")
				.setAuthor(message.member.nickname, message.author.avatarURL())
				.addField("Error", "An error has occurred.");
			message.channel.send(embed
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
			bot.users.cache.get("268138992606773248").send(embed.addField("Link:", message.url).addField("Error:", error));
		});
		return;
	}

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try {
		// eslint-disable-next-line no-undef
		command.execute(message, args, Discord, showcaseCooldown, currency, CurrencyShop, Users, Op, prefix, godModeUsers, errorReplies);
	} catch (error) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.addField("Error", "An error has occurred.");
		message.channel.send(embed
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
		bot.users.cache.get("268138992606773248").send(embed.addField("Link:", message.url).addField("Error:", error));
	}
});

// Logs the bot into Discord. If I accidentally post the token to GitHub, Discord's "token-scanning gremlins" will automatically reset it. (see https://discord.com/channels/)
bot.login(token);