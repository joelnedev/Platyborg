/* eslint-disable no-case-declarations */

/*
For the sake of transparency, I'm gonna add comments explaining almost every line (and do my best not to get too technical so 8 year olds like Spoons can understand :trolololo:). 
I want to make sure that the admins' trust in me/Chintow is rightfully placed. 
If any further elaboration/explanation is needed, dm me (you probably already know, but it's JuhJuhButt#1234) or file an issue on the GitHub.
This bot is made mostly for the memes, but it also has real functions such as posting to #showcase (similar to how #suggestions works) and starboard (coming soon to a bookstore near you).
*/

// This block sets important things needed throughout the script.
// Of course, I need to import the Discord.js library to use it. I'll be calling it via "Discord".
const Discord = require("discord.js");

// For my bot to have a user, it needs a client, similar to how you need a mobile or desktop client to get to Discord. Most people call it using "client", 
// but I feel that "bot" is more concise and transparent.
const bot = new Discord.Client();

// Every bot needs a prefix, this is pretty self-explanatory.
const { prefix, token } = require("./info/config.json");

// Get random reply messages to use later.
const { errorReplies } = require("./info/randomMessages.json");

// Simplified: finds commands. I'm sure that if you're technical enough for that to be basic, you can read this on your own (and are probably the wored or lonk).
const fs = require("fs");
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
bot.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// This code block runs only once, on the event "ready" which triggers once my bot has logged in and is ready to interact with Discord.
bot.once("ready", () => {

	// This sets the bot's status to "Making beancurd".
	bot.user.setActivity("YouTube tutorials of beancurd", {type: "WATCHING"});

	// In the terminal from which my bot is launched, it will log "I'm in."
	console.log("I'm in.");
});

// This code block runs every time a reaction is added to a message, and passes the reaction object for usage inside the callback script.
bot.on("messageReactionAdd", reaction => {
	async function starboard(reaction, user) {
		const message = reaction.message;

		// This is the first check where we check to see if the reaction is not the unicode star emote.
		if (reaction.emoji.name !== "⭐") return;

		// Here we check to see if the person who reacted is the person who sent the original message.
		if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);

		// This is our final check, checking to see if message was sent by a bot.
		if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);

		// Here we set the starboard channel. 
		const starboardChannel = message.client.channels.cache.get("");
		const fetchedMessages = await starboardChannel.messages.fetch({ limit: 100 });
		const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));
		if (stars) {
			// I barely know what's going on in this line 
			const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
			const foundStar = stars.embeds[0];
			const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : "";
			const embed = new Discord.MessageEmbed()
				.setColor(foundStar.color)
				.setDescription(foundStar.description)
				.setAuthor(message.author.tag, message.author.displayAvatarURL)
				.setTimestamp()
				.setFooter(`⭐ ${parseInt(star[1]) + 1} | ${message.id}`)
				.setImage(image);
			const starMsg = await starboardChannel.messages.fetch(stars.id);
			await starMsg.edit({ embed });
		}
		if (!stars) {
			const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : "";
			if (image === "" && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
			const embed = new Discord.MessageEmbed()
				.setColor(15844367)
				.setDescription(message.cleanContent)
				.setAuthor(message.author.tag, message.author.displayAvatarURL)
				.setTimestamp(new Date())
				.setFooter(`⭐ 1 | ${message.id}`)
				.setImage(image);
			await starboardChannel.send({ embed });
		}
	}

	/*// Here we add the this.extension function to check if there's anything attached to the message.
	extension(reaction, attachment) {
		const imageLink = attachment.split('.');
		const typeOfImage = imageLink[imageLink.length - 1];
		const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
		if (!image) return '';
		return attachment;
	}*/
	starboard(reaction, reaction.message.member.nickname);
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
bot.on("message", message => {

	// This function makes it easy to send errors,
	function errorFunction(message, error) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error :rotating_light:")
			.setColor("#ff0000")
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.addField("Error", error);
		message.channel.send(embed
			.setDescription(errorReplies[Math.floor(Math.random() * errorReplies.length)])
			.addField("Don't ping dev", "No need to ping JuhJuhButt, he's already been sent a copy of the error message."));
		bot.users.cache.get("268138992606773248").send(embed.addField("Link:", message.url));
		
	}

	// These lines initiate the sets "talkedRecently" and "showcaseCooldown". It is by no means perfect, but it is a funcioning cooldown system.
	const talkedRecently = new Set;
	const showcaseCooldown = new Set;

	// This block sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (["egis", "egis"].some(egis => message.content.toLowerCase().includes(egis)) && !message.channel.id === "712991588376117308" && message.author.id !== bot.user.id) {
		message.channel.send("egis");
	}

	// Besides messages containing "egis", Chintow will ignore messages that don't start with the prefix or are from other bots.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// This slices messages into arguments and ignores multiple spaces in a row.
	const args = message.content.slice(prefix.length).split(/ +/);

	// This takes the first argument out of the array and sets it as the command name.
	const commandName = args.shift().toLowerCase();

	// It then indexes the commands in the ./commands folder.
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	
	// If a user used a command within 5 seconds, dm them and tell them to shut the up.
	if (talkedRecently.has(message.author.id)) {
		message.author.send("Stop spamming :face_with_symbols_over_mouth:");
		return;
	}

	// If the comand doesn't exist, let the user know
	if (!command) {
		message.channel.send(errorReplies[Math.floor(Math.random() * errorReplies.length)]);
		return;
	}
	// If a user has used showcase recently, dm them with an explanation about the cooldown.
	if (showcaseCooldown.has(message.author.id)) {
		message.author.send("You can post one showcase every 5 minutes. To discuss a showcase, use the appropriate channel (or sopones wil bane you :banned:)");
		return;
	}

	// After exiting if they've talked recently, add them to the "talkedRecently" array for 5000 ms (5 seconds)
	talkedRecently.add(message.author.id);
	setTimeout(() => {
		talkedRecently.delete(message.author.id);
	}, 5000);

	// This will run different functions based on the command executed. If something goes wrong, let the user and I know.
	try {
		command.execute(message, args, Discord, showcaseCooldown);
	} catch (error) {
		errorFunction(message, error);
	}
});

// Logs the bot into Discord. If I accidentally post the token to GitHub, Discord's "token-scanning gremlins" will automatically reset it. (see https://discord.com/channels/)
bot.login(token);