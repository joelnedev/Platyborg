/*
For the sake of transparency, there will be comments explaining a ton of stuff.
If any further elaboration/explanation is needed, start a discussion on the GitHub.
*/

// Imports/exports my types as I finally switched to TypeScript.
import { Bot, blackMarket } from "./util/exports.js";

// Of course, I need to import necessary properties of the discord.js library to use them. I'll be calling the properties directly.
import { Client, MessageEmbed, CommandInteraction, GuildMember, } from "discord.js";

// @ts-expect-error | For my bot to have a user, it needs a client (similar to how you need a mobile or desktop client to get to Discord).
export const Vagan: Bot = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS", "GUILD_WEBHOOKS", "GUILD_MESSAGES"] });

// Calls important data such as the prefix, da-slash settings, token, and replies via Vagan.config
import config from "./util/info/config.js";
Vagan.config = config;

// This block runs immediately, and the code inside it runs when their respective databases are ready.
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

// Allows me to easily debug Vagan by logging info when necessary.
Vagan.on("debug", console.log);
Vagan.on("error", console.error);

// This code block runs only once on the event "ready", which triggers once Vagan has logged in and is ready to interact with Discord.
Vagan.once("ready", async () => {

	// This sets Vagan's status to "Playing with guns|Amazing pfp by talk14#5057".
	Vagan.user?.setActivity("Not responding to commands, currently in debug mode");

	// In the terminal from which Vagan is launched, it will log "I'm in."
	console.log("I'm in.");

	// Sets easy way to get/do common things without having to take up too much space.
	Vagan.KBC = await Vagan.guilds.fetch("677965121116700723"); // @ts-expect-error
	Vagan.hideout = await Vagan.guilds.fetch("794303785572237322");
	Vagan.hideout.godModeUsers = (await Vagan.hideout.roles.fetch("797151488493223986"))?.members.array().map(member => member.id)!; // @ts-expect-error
	Vagan.hideout.logChannel = Vagan.hideout.channels.cache.get("797151756613058600");
	Vagan.handleError = async (error: string, interaction?: CommandInteraction) => {
		const member = new GuildMember(Vagan, interaction?.member!, Vagan.KBC);
		const embed = new MessageEmbed()
			.setTitle("Error 🚨")
			.setColor("#ff0000")
			.setAuthor(interaction ? member.displayName : '', interaction ? member.user.displayAvatarURL() : '')
			.addField("Error", "An error has occurred.");
		await interaction?.reply({ embeds: [embed
			.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
			.addField("No action needed", "The dev has already recieved further information.")], ephemeral: true });
		Vagan.hideout.logChannel.send({ embeds: [embed.addField("Link:", Vagan.user?.lastMessage?.url!).addField("Error:", error)] });
		Vagan.emit("debug", error);
	};
	Vagan.emit("debug", `KBC Availability: ${Vagan.KBC.available}`);
	Vagan.emit("debug", `VH Availability: ${Vagan.hideout.available}`);
	Vagan.emit("debug", `VH God Mode Users: ${Vagan.hideout.godModeUsers.join(", ")}`);
	Vagan.emit("debug", `VH Log Channel: ${Vagan.hideout.logChannel.id}`);
});

// This code block runs every time one of Vagan's slash commands is used, and passes the request object for usage inside the callback script.
Vagan.on("interaction", async interaction => {
	if (!interaction.isCommand()) return;
	if (!(interaction.member instanceof GuildMember)) interaction.member = await Vagan.KBC.members.fetch(interaction.user.id);
	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try { import(`./commands/${interaction.commandName}`) }
	catch (error) { Vagan.handleError(error, interaction); }
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
Vagan.on("message", async message => {

	// This line sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (message.content.toLowerCase().includes("egis") && message.channel.id !== "712991588376117308" && message.author.id !== Vagan.user?.id) await message.reply("egis");

	// Sends a random ping message if someone pings Vagan
	if (message.content.match(new RegExp(`<@!?${Vagan.user?.id}>`))) await message.reply(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)]);
});

// Logs Vagan into Discord (it automatically searches for process.env.DISCORD_TOKEN and uses it to log in if no parameters are provided)
Vagan.login();