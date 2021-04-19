/*
For the sake of transparency, there will be comments explaining a ton of stuff.
If any further elaboration/explanation is needed, start a discussion on the GitHub.
*/

// -- This block sets important things needed throughout the script. --

// Imports/exports my types as I finally switched to TypeScript.
import { Bot, blackMarket, Client, Interaction } from "./util/exports.js";

// Of course, I need to import necessary properties of the discord.js library to use them. I'll be calling the properties directly.
import { Client as discordClient, MessageEmbed, Message, TextChannel, } from "discord.js";

// @ts-expect-error | For my bot to have a user, it needs a client (similar to how you need a mobile or desktop client to get to Discord).
const Vagan: Bot = new discordClient({ intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS", "GUILD_WEBHOOKS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"], partials: ["MESSAGE", "USER", "REACTION"] });

// Calls important data such as the prefix, da-slash settings, token, and replies via Vagan.config
import config from "./util/info/config.js";
Vagan.config = config;

// Uses my module from `util/interactions` to manipulate slash commands on Vagan.
const client = new Client(Vagan);

// This line initiates the set "showcaseCooldown". It isn't perfect, but it is a funcioning cooldown system.
Vagan.showcaseCooldown = new Set;

// -- End of declarations and stuff --

// This block runs as soon as the parser reaches this line, and the code inside it runs when their respective databases are ready.
(async () => { // @ts-expect-error
	await blackMarket.users.defer.then(async () => {
		console.log(`Connected, there are ${await blackMarket.users.size} rows in the users database.`);
	}); // @ts-expect-error
	await blackMarket.items.defer.then(async () => {
		console.log(`Connected, there are ${await blackMarket.items.size} rows in the items database.`);
	}); // @ts-expect-error
	await blackMarket.roles.defer.then(async () => {
		console.log(`Connected, there are ${await blackMarket.roles.size} rows in the roles database.`);
	});
})();

// -- This block runs functions when Discord tells Vagan that something happened. --

// Allows me to easily debug Vagan by logging info when necessary.
Vagan.on("debug", console.log);

// This code block runs only once on the event "ready", which triggers once Vagan has logged in and is ready to interact with Discord.
Vagan.once("ready", async () => {

	// This sets Vagan's status to "Playing with guns|Amazing pfp by talk14#5057".
	Vagan.user?.setActivity("Not responding to commands, currently in debug mode");

	// In the terminal from which Vagan is launched, it will log "I'm in."
	console.log("I'm in.");

	// Refreshes the slash commands list with what's currently in ./commands/
	client.postCommands();

	// Sets easy way to get/do common things without having to take up too much space.
	Vagan.KBC = await Vagan.guilds.fetch("677965121116700723"); // @ts-expect-error
	Vagan.hideout = await Vagan.guilds.fetch("794303785572237322"); // @ts-expect-error
	Vagan.hideout.godModeUsers = (await Vagan.hideout.roles.fetch("797151488493223986"))?.members.array().map(member => member.id); // @ts-expect-error
	Vagan.hideout.logChannel = Vagan.hideout.channels.cache.get("797151756613058600");
	Vagan.handleError = async (error: string, interaction?: Interaction) => {
		const embed = new MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(interaction? interaction?.member.displayName : "undefined", interaction ? interaction?.author.displayAvatarURL() : '')
			.addField("Error", "An error has occurred.");
		await interaction?.respond(undefined, { embed: embed
			.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
			.addField("No action needed", "The dev has already recieved further information.")});
		Vagan.hideout.logChannel.send(embed.addField("Link:", Vagan.user?.lastMessage?.url).addField("Error:", error));
		Vagan.emit("debug", error);
	};
	Vagan.emit("debug", `KBC Availability: ${Vagan.KBC.available}`);
	Vagan.emit("debug", `VH Availability: ${Vagan.hideout.available}`);
	Vagan.emit("debug", `VH God Mode Users: ${Vagan.hideout.godModeUsers.join(", ")}`);
	Vagan.emit("debug", `VH Log Channel: ${Vagan.hideout.logChannel.id}`);
});

// This code block runs every time a reaction is added to a message, and passes the reaction object for usage inside the callback script.
Vagan.on("messageReactionAdd", async reaction => {

	let message: Message | MessageEmbed = reaction.message;

	// Ignores if the reaction wasn't made in showcase, the reaction message wasn't sent by Vagan, or if the reaction emoji isn't a star.
	if (message.channel.id !== "702481578529652796" || message.author.id !== Vagan.user?.id || reaction.emoji.name !== "⭐") return;

	// @ts-expect-error | Finds the author based on the display name in the embed
	const author = Vagan.KBC.members.cache.find((member) => member.displayName === message.embeds[0].author?.name);

	// Finds the color based on the username/nickname provided in the author field of the embed (if it can't find the user, it sets it to the yellow that carl-bot uses)
	const color = author?.displayHexColor || "#FFD966";

	const extension = (attachment: string) => {
		const imageLink = attachment.split('.');
		const typeOfImage = imageLink[imageLink.length - 1];
		const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
		if (!image)
			return '';
		return attachment;
	} // @ts-expect-error

	const starChannel: TextChannel = await Vagan.channels.fetch("723973040375070761");
	const fetchedMessages = await starChannel.messages.fetch({ limit: 100 }); // @ts-expect-error
	const stars = fetchedMessages.find(m => m.content.startsWith('⭐') && m.author.id === Vagan.user?.id && m.embeds[0].footer?.text === message.id);
	if (stars) { // @ts-expect-error
		const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer?.text);
		const foundStar = stars.embeds[0];
		const image = message.attachments.size > 0 ? extension(message.attachments.array()[0].url) : '';
		const embed = new MessageEmbed()
			.setColor(color)
			.setDescription(foundStar.description)
			.setAuthor(foundStar.author?.name, foundStar.author?.url)
			.setTimestamp()
			.setFooter(`${message.id}`)
			.setImage(image)
			.addField("Source", `[Jump!](${message.url})`);
		const starMsg = await starChannel.messages.fetch(stars.id); // @ts-expect-error
		await starMsg.edit(`⭐ ${parseInt(star[1])+1}`, { embed });
	} else {
		const image = message.embeds[0].image ? extension(message.embeds[0].image?.url) : '';
		message = message.embeds[0];
		const embed = new MessageEmbed()
			.setColor(color)
			.setDescription(message.description)
			.setAuthor(message.author?.name, message.author?.url)
			.setTimestamp()
			.setFooter(`${reaction.message.id}`)
			.setImage(image)
			.addField("Source", `[Jump!](${reaction.message.url})`);
		!image ? embed.addField("No attachment", "The author didn't attach anything.") : '';
		await starChannel.send("⭐ 1", { embed });
	}
});


// This code block runs every time one of Vagan's slash commands is used, and passes the request object for usage inside the callback script.
Vagan.on("interactionCreate", async interaction => {

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try {
		
	} catch (error) {
		Vagan.handleError(error, interaction);
	}
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
Vagan.on("message", async message => {

	// This line sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (message.content.toLowerCase().includes("egis") && message.channel.id !== "712991588376117308" && message.author.id !== Vagan.user?.id) await message.channel.send("egis");

	// Sends a random ping message if someone pings Vagan
	if (message.content.match(new RegExp(`<@!?${Vagan.user?.id}> `))) await message.channel.send(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)]);
});

// -- End of event callbacks --

// Logs Vagan into Discord (it automatically searches for process.env.DISCORD_TOKEN and uses it to log in if no parameters are provided)
Vagan.login();