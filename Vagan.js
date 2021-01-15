// eslint-disable no-case-declarations 

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
const config = require("./info/config.json");

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

// Uses npm modules to create, get, edit, and delete slash commands.
// eslint-disable-next-line no-undef
const discordSlashCommandsClient = require("discord-slash-commands-client"); 

// Allows me to call my interactions stuff via "client".
const client = new discordSlashCommandsClient.Client(config.bot.token, "766295959700897813");

// Allows me to call more interactions stuff via "interactions".
// eslint-disable-next-line no-undef
const interactions = require("da-slash");


// These lines initiate the sets "talkedRecently" and "showcaseCooldown". It isn't perfect, but it is a funcioning cooldown system.
const talkedRecently = new Set;
const showcaseCooldown = new Set;

// Finds files in ./commands that end in .js, then adds it to the bot.commands collection.
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

// Finds files in ./slash that end in .js, then adds it to the client.commands collection.
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
});

// This code block runs every time a reaction is added to a message, and passes the reaction object for usage inside the callback script.
bot.on("messageReactionAdd", async reaction => {
	// Ignores if the reaction wasn't made in showcase, the reaction message wasn't sent by Vagan, or if the reaction emoji isn't a star.
	if (!reaction.message.channel.id === "showcase id" || !reaction.message.author.id === bot.user.id || !reaction.emoji.name === "star") return;
	
	// This code block runs only if the number of stars on the message is 8.
	if (reaction.count === 8) {
		// Finds the color based on the username/nickname provided in the author field of the embed (if it can't find the user, it sets it to the blue I use for informational embeds)
		const color = bot.users.cache.find(user => user.username === reaction.message.embeds[0].author.name)
			|| bot.users.cache.find(user => user.nickname === reaction.message.embeds[0].author.name)
			|| "#03b1fc";

		// Constructs an embed and assigns properties on declaration.
		const embed = new Discord.MessageEmbed()
			.setTitle("Message starred")
			.setTimestamp()
			.setColor(color);
		
		// Assigns values if they exist.
		if (!reaction.message.embeds[0].description === "The author didn't add a caption") embed.setDescription(reaction.message.embeds[0].description);
		if (reaction.message.embeds[0].image) embed.setImage(reaction.message.embeds[0].image.url);

		// Sends the embed.
		bot.channels.cache.get("starboard id").send(embed);
	}
});


// This code block runs every time a slash command is used, and passes the interaction object for usage inside the callback script.
bot.on("interactionCreate", async interaction => {

	// This splits the content after the main command into arguments and ignores multiple spaces in a row.
	const args = interaction.content.split(/ +/);

	// It then indexes the commands from the ./slash folder.
	const command = client.commands.get(interaction.name)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.name));

	const nickname = interaction.member.nickname
		||interaction.author.username;

	bot.api.interactions(interaction.id, interaction.token).callback.post({
		type: command.responseType
	});

	// If a command requires arguments but none are provided, let them know.
	if (command.args === true && !args.length) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(nickname, interaction.author.avatarURL())
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("Error", "Insufficient information", true);

		// If the command has defined usage, provide it to the user.
		if (command.usage) {
			embed.addField("Usage:", `/${command.name} ${command.usage}`);
		}

		// Send the embed and handle an error if one occurs.
		interaction.channel.send(embed).catch((error) => {
			const embed = new Discord.MessageEmbed()
				.setTitle("Error 🚨")
				.setColor("#ff0000")
				.setAuthor(nickname, interaction.author.avatarURL())
				.addField("Error", "An error has occurred.");
			interaction.channel.send(embed
				.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
				.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
			bot.channels.cache.get("797151756613058600").send(embed.addField("Link:", bot.user.lastMessage.url).addField("Error:", error));
		});
		return;
	}

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try {
		// eslint-disable-next-line no-undef
		command.execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config.bot.prefix, godModeUsers, errorReplies, showcaseCooldown);
	} catch (error) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(nickname, interaction.author.avatarURL())
			.addField("Error", "An error has occurred.");
		interaction.channel.send(embed
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
		bot.channels.cache.get("797151756613058600").send(embed.addField("Link:", bot.user.lastMessage.url).addField("Error:", error));
	}
	
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
bot.on("message", async message => {

	// This block sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (["egis", "egis"].some((egis) => message.content.toLowerCase().includes(egis)) && !message.channel.id === "712991588376117308" && message.author.id !== bot.user.id) {
		message.channel.send("egis");
	}

	// Besides messages containing "egis", Vagan will ignore messages that don't start with the prefix, are from other bots, or are sent via dm.
	if (!message.content.startsWith(config.bot.prefix) || message.author.bot || message.channel.type === "dm") return;

	// This splits messages into arguments and ignores multiple spaces in a row.
	const args = message.content.slice(config.bot.prefix.length).split(/ +/);

	// This takes the first argument out of the array and sets it as the command name.
	const commandName = args.shift().toLowerCase();

	// It then indexes the commands from the ./commands folder.
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	const nickname = message.member.nickname
		|| message.author.username;

	
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
	// I'm locking it to specific people instead of godmode users cause this is fucking dangerous (gives them access to my whole server which is currently my school laptop)

	const clean = text => {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	};
	
	if (message.content.startsWith(config.bot.prefix + "eval")) {
		if(message.author.id !== "268138992606773248" || message.author.id !== "362374840201510914") return;
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
			embed.addField("Usage:", config.bot.prefix + command.name + command.usage);
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
			bot.channels.cache.get("797151756613058600").send(embed.addField("Link:", message.url).addField("Error:", error));
		});
		return;
	}

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try {
		// eslint-disable-next-line no-undef
		command.execute(message, args, Discord, nickname, showcaseCooldown, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies);
	} catch (error) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.addField("Error", "An error has occurred.");
		message.channel.send(embed
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("No action needed", "The dev has already recieved a copy of the error, you'll likely hear from him soon."));
		bot.channels.cache.get("797151756613058600").send(embed.addField("Link:", message.url).addField("Error:", error));
	}
});

// Logs the bot into Discord. If I accidentally post the token to GitHub, Discord's "token-scanning gremlins" will automatically reset it. (see https://discord.com/channels/677965121116700723/677965383210237970/796369518049755177)
bot.login(config.bot.token);