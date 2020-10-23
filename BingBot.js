/* eslint-disable no-case-declarations */
/*
For the sake of transparency, I'm gonna add comments explaining almost every line (and do my best not to get too technical). 
I want to make sure that the admins' trust in me/BingBot is rightfully placed. 
If any further elaboration/explanation is needed, dm me (you probably already know, but it's JuhJuhButt#1234) or file an issue on the GitHub.

This bot is made mostly for the memes, but it also has real functions such as posting to #showcase (similar to how #suggestions works) and starboard (coming soon to a bookstore near you).
*/ 

// This block sets important things needed throughout the script
// Of course, I need to import the Discord.js library to use it. I'll be calling it via "Discord".
const Discord = require("discord.js");

// For my bot to have a user, it needs a client, similar to how you need a mobile or desktop client to get to Discord. Most people call it with "client", but I
// feel that "bot" is more concise and transparent.
const bot = new Discord.Client();

// Every bot needs a prefix, this is pretty self-explanatory.
const prefix = "/";

// This code block runs only once, on the event "ready" which triggers once my bot has logged in and is ready to interact with Discord.
bot.once("ready", () => {
	// This sets the bot's status to `Playing **Chintow**` cause BingBot is a player :sunglasses:
	bot.user.setActivity("Chintow");

	// In the terminal from which my bot is launched, it will log "I'm in."
	console.log("I'm in.");
});


// This code block runs every time a message has sent, and passes the message object for usage inside the script.
bot.on("message", message => {
	// These lines initiate the arrays "talkedRecently" and "showcaseCooldown". It is by no means perfect, but it is a funcioning cooldown system.
	const talkedRecently = [];
	const showcaseCooldown = [];

	// This line ignores messages from llarc cause he was spamming the bot in general. Probably gonna remove it sooner or later.
	if (message.author.id === "264507630045757481") return;

	// This block sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (["egis"].some(egis => message.content.toLowerCase().includes(egis)) && !message.channel.id === "712991588376117308" && message.author.id !== bot.user.id) {
		message.channel.send("egis");
	}

	// Besides messages containing "egis", BingBot will ignore messages that don't start with the prefix or are from other bots.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// This slices messages into arguments and ignores multiple spaces in a row.
	const args = message.content.slice(prefix.length).split(/ +/);

	// This takes the first argument out of the array and sets it to the command.
	const command = args.shift().toLowerCase();

	// If a user has talked recently, dm them and tell them to shut the up.
	if (talkedRecently.has(message.author.id)) {
		message.author.send("Stop spamming :face_with_symbols_over_mouth:");
		return;
	}

	// If a user has used showcase recently, dm them with an explanation about the cooldown.
	if (showcaseCooldown.has(message.author.id)) {
		message.author.send("You can post one showcase every 5 minutes. To discuss a showcase, use the appropriate channel (or sopones wil bane you :banned:)");
		return;
	}

	// After checking if they've talked recently, add them to the "talkedRecently" array for 5000 ms (5 seconds)
	talkedRecently.add(message.author.id);
	setTimeout(() => {
		talkedRecently.delete(message.author.id);
	}, 5000);

	// This will run different functions based on the command executed.
	switch (command) {

	// If the command is "purpose", explain the bot's purpose (or rather the relevance).
	case "purpose":
		message.channel.send(`you don't have a purpose either. stop bullying me, ${message.author.id}`);
		break;
		
		// If the command is "ban" or any of its aliases, pretend to ban someone.
	case "ban":
	case "bane":
		const banReplies = ["ok. he (or ohter g**ender(i cant say that bad word)) has ben BANDD from be ean!", "bro don't say that or poope will get mad at you"];
		message.channel.send(banReplies[Math.floor(Math.random() * banReplies.length)]);
		break;
		// If the command is "warn", warn them.
	case "warn":
		message.channel.send("ok");
		message.author.send("bro you got warned <:troll4k:766761770353950787>");
		break;
		// If the command is "stoneworm" or any of its aliases, provide helpful information about them.
	case "stoneworm":
	case "stonwrom":
	case "sotenwored":
	case "stenwor":
	case "wored":
	case "stoenwarudo":
		const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin",];
		message.channel.send(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
		break;
		// If the command is "spoon" or any of its aliases, provide helpful information about them.
	case "spoons":
	case "spoon":
	case "spoonman":
	case "sopons":
	case "spones":
	case "sopones":
		message.channel.send("he is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
		break;
		// If the command is say, say what they said to, then delete what they said and say why.
	case "say":
		message.channel.send(args.slice(0).join(" "));
		message.delete(`trolololo (${prefix}say command :grin:)`);
		break;
		// If the command is post or any of its aliases, execute the command (I'll provide legitimately helpful explanations in the command).
	case "post":
	case "show":
	case "showcase":
	case "art":
		// Self-explanatory: lets the user know that sending multiple images screws stuff up.
		message.channel.send("btw, if you send multiple images it'll mess stuff up so dont do that please and thanks"); 
		// Creates a message embed and assigns properties on declaration.
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setColor("#00ff00")
			.setTitle(`Showcase by ${message.member.nickname}`)
			.setFooter(`If you want to post your own showcase, go to #showcase-discussion and type \`${prefix}post\` with an attached image`)
			.setTimestamp();
		// Assign properties if they exist
		if (message.attachments) {
			embed.setImage(message.attachments.last().proxyURL);
		} else {
			embed.addField("No attachment", "The author didn't attach anything");
		}
		if (args[0]) {
			embed.setDescription(args.slice(0).join(" "));
		} else {
			embed.setDescription("The author didn't add a caption");
		}
		// Cooldown
		showcaseCooldown.add(message.author.id);
		setTimeout(() => {
			showcaseCooldown.delete(message.author.id);
		}, 5000);
		// Send the embed
		bot.channels.cache.get("702481578529652796").send(embed);			
		break;
	// If JuhJuhButt executes "kill", kill the process.
	case "kill":
		if (message.author.id === "268138992606773248") {
			// eslint-disable-next-line no-undef
			process.kill();
		}
		// eslint-disable-next-line indent

	// If the command does not exist, let the user know. 
	// eslint-disable-next-line no-fallthrough
	default:
		message.channel.send(":moyai: that's not even a valid command what's wrong with you");
	}
});

// Logs the bot into Discord. If I accidentally post the token to GitHub, Discord will automatically reset it.
bot.login("NzY2Mjk1OTU5NzAwODk3ODEz.X4hSuQ.cpB_4hpH39ZXIiSykjm7MsrBlNc");