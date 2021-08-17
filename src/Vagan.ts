/*
For the sake of transparency, there will be comments explaining a ton of stuff.
If any further elaboration/explanation is needed, start a discussion on the GitHub.
*/


// Imports Winston for better logging
import winston from "winston";

// Imports my types as I finally switched to TypeScript.
import { Bot, blackMarket, config } from "./util/exports.js";

// Of course, I need to import necessary properties of the discord.js library to use them. I'll be calling the properties directly.
import { Client, MessageEmbed, CommandInteraction, GuildMember, TextChannel, } from "discord.js";

// @ts-expect-error 2739 | For my bot to have a user, it needs a client (similar to how you need a mobile or desktop client to get to Discord).
export const Vagan: Bot = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_WEBHOOKS", "GUILD_MESSAGES"] });

Vagan.config = config;
Vagan.logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "log" })
	],
	format: winston.format.printf(log => {
		const date = new Date();
		return `[${log.level.toUpperCase()} ${date.getDate()}/${date.getMonth() - 1}/${date.getFullYear() - 2000} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${log.message}]`
	})
});

const { logger } = Vagan;

import * as path from "path"
import * as dotenv from "dotenv";
logger.log("info", dotenv.config({ encoding: "UTF-8" }));

// This block runs immediately, and the code inside it runs when their respective databases are ready.
(async () => { // @ts-expect-error
	await blackMarket.users.defer.then(async () => {
		logger.log("info", `Connected, there are ${await blackMarket.users.size} rows in the users database.`);
	}); // @ts-expect-error
	await blackMarket.items.defer.then(async () => {
		logger.log("info", `Connected, there are ${await blackMarket.items.size} rows in the items database.`);
	}); // @ts-expect-error
	await blackMarket.roles.defer.then(async () => {
		logger.log("info", `Connected, there are ${await blackMarket.roles.size} rows in the roles database.`);
	});
})();

// A function to quickly set Vagan's application commands
import { readdirSync } from "fs";
const setCommands = async () => {
	const commands = [];
	for (const file of readdirSync(path.join(process.cwd(), "dist", "commands")).filter(file => file.endsWith('.js'))) commands.push((await import(`./commands/${file}`)).help);
	Vagan.application?.commands.set(commands);
}

// @ts-expect-error 2769 Allows me to easily debug Vagan by logging info when necessary.
Vagan.on("debug", m => logger.log("debug", m));
Vagan.on("warn", console.warn);
Vagan.on("error", console.error);

// This code block runs only once on the event "ready", which triggers once Vagan has logged in and is ready to interact with Discord.
Vagan.once("ready", async () => {

	// This sets Vagan's status to "Playing with guns".
	Vagan.user?.setActivity("with guns");

	// In the terminal from which Vagan is launched, it will log "I'm in."
	logger.log("info", "I'm in.");

	// Sets easy way to get/do common things without having to take up too much space.
	Vagan.KBC = await Vagan.guilds.fetch("677965121116700723"); // @ts-expect-error 2739
	Vagan.hideout = await Vagan.guilds.fetch("794303785572237322");
	Vagan.hideout.godModeUsers = (await Vagan.hideout.roles.fetch("797151488493223986"))?.members.map(member => member.id)!;
	Vagan.hideout.logChannel = await Vagan.hideout.channels.fetch("797151756613058600") as TextChannel;
	Vagan.handleError = async (error: string, interaction?: CommandInteraction) => {
		const member = new GuildMember(Vagan, interaction?.member!, Vagan.KBC);
		const embed = new MessageEmbed()
			.setTitle("Error 🚨")
			.setColor(0xff0000)
			.setAuthor(interaction ? member.displayName : '', interaction ? member.user.displayAvatarURL() : '')
			.addField("Error", "An error has occurred.");
		await interaction?.reply({ embeds: [embed
			.setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
			.addField("No action needed", "The dev has already recieved further information.")], ephemeral: true });
		Vagan.hideout.logChannel.send({ embeds: [embed.addField("Link:", (await interaction?.channel?.messages.fetch(interaction?.id))?.url!).addField("Error:", error)] });
		Vagan.emit("debug", error);
	};
	Vagan.emit("debug", `KBC Available: ${Vagan.KBC.available}`);
	Vagan.emit("debug", `VH Available: ${Vagan.hideout.available}`);
	Vagan.emit("debug", `VH God Mode Users: ${Vagan.hideout.godModeUsers.join(", ")}`);
	Vagan.emit("debug", `VH Log Channel: ${Vagan.hideout.logChannel.id}`);

	if (process.env.SET_COMMANDS != undefined) await setCommands();
});

// This code block runs every time one of Vagan's slash commands is used, and passes the request object for usage inside the callback script.
Vagan.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return; // @ts-expect-error 2739
	interaction.member = { user: { id: interaction.member?.user.id! }};

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try { await import(`./commands/${interaction.commandName}.js`).then(cmdfile => cmdfile.execute(interaction)); }
	catch (error) { Vagan.handleError(error, interaction); }
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
Vagan.on("messageCreate", async message => {

	// This line sends "egis" if someone says egis outside of the #egis channel. To prevent loopholes, it ignores itself.
	if (message.content.toLowerCase().includes("egis") && message.channel.id !== "712991588376117308" && message.author.id !== Vagan.user?.id) await message.reply("egis");

	// Sends a random ping message if someone pings Vagan
	if (message.content.match(new RegExp(`<@!?${Vagan.user?.id}>`))) await message.reply(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)]);
});

// Logs Vagan into Discord
Vagan.login(process.env.DISCORD_TOKEN);