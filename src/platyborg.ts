(await import('dotenv')).config({ encoding: "UTF-8" });

// Imports my types (and the blackMarket object) as I finally switched to TypeScript.
import { Bot, blackMarket, config, logger, truthOrDare } from "./util/index.js";

// Of course, I need to import necessary properties of the discord.js library to use them. I'll be calling the properties directly.
import { Client, MessageEmbed, CommandInteraction, GuildMember, TextChannel, } from "discord.js";

// @ts-expect-error 2739 | For my bot to have a user, it needs a client (similar to how you need a mobile or desktop client to get to Discord).
export const platyborg: Bot = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_WEBHOOKS", "GUILD_MESSAGES"] });

platyborg.config = config;
platyborg.logger = logger;

// A function to set Platyborg's application commands
import * as path from "path"
import { readdirSync } from "fs";
const setCommands = async () => {
	const commands: any = [];
	for (const file of readdirSync(path.join(process.cwd(), "dist", "commands")).filter(file => file.endsWith('.js'))) commands.push((await import(`./commands/${file}`)).help);
	platyborg.application?.commands.set(commands);
}

// Allows me to easily debug Platyborg by logging info when necessary.
platyborg.on("debug", m => { logger.verbose(m) });
platyborg.on("warn", m => { logger.warn(m) });
platyborg.on("error", m => { logger.error(m) });

// This code block runs only once on the event "ready", which triggers once platyborg has logged in and is ready to interact with Discord.
platyborg.once("ready", async () => {

	// This sets Platyborg's status to "Playing with guns".
	platyborg.user?.setActivity("with guns");

	logger.verbose(`Connected, there are ${await blackMarket.users.size} rows in the users database.`);
	logger.verbose(`Connected, there are ${await blackMarket.items.size} rows in the items database.`);
	logger.verbose(`Connected, there are ${await truthOrDare.db.size} rows in the TOD database.`);

	// Sets easy way to get/do common things without having to take up too much space.
	platyborg.PFC = await platyborg.guilds.fetch("677965121116700723"); // @ts-expect-error 2739
	platyborg.hideout = await platyborg.guilds.fetch("794303785572237322");
	platyborg.hideout.godModeUsers = (await platyborg.hideout.roles.fetch("797151488493223986"))?.members.map((m, id) => id)!;
	platyborg.handleError = async (interaction: CommandInteraction, error?: string) => {
		await interaction.reply({ content: "Something went wrong. The error has been logged and will be addressed soon.", ephemeral: true });
		logger.error(error);
	}; // @ts-expect-error 2741
	platyborg.emoji = {
		beancoin: "797156957718315048",
		beancoin_bad: "797153036606111834",
		beancoin_og: "797154654802018304",
		beancoinifitwas: "797157014156345394",
		kbcheck: "819637115154858014",
		kbx: "819647169036156928"
	};
	platyborg.emoji.randomBeancoin = async () => {
		const emojis = [ platyborg.emoji.beancoin, platyborg.emoji.beancoin_bad, platyborg.emoji.beancoin_og, platyborg.emoji.beancoinifitwas ];
		return await platyborg.hideout.emojis.fetch(emojis[Math.floor(Math.random() * emojis.length)]);
	}

	logger.debug(`PFC Available: ${platyborg.PFC.available}`);
	logger.debug(`VH Available: ${platyborg.hideout.available}`);
	logger.debug(`VH God Mode Users: ${platyborg.hideout.godModeUsers.join(", ")}`);

	if (process.env.SET_COMMANDS != undefined) await setCommands();

	// In the terminal from which Platyborg is launched, it will log "I'm in."
	logger.info("I'm in.");
});

// This code block runs every time one of Platyborg's slash commands is used, and passes the request object for usage inside the callback script.
platyborg.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;
	logger.debug(`${interaction.user.tag} ran ${interaction.commandName}`);

	// This will run different functions based on the command executed. If something goes wrong, it lets the user and I know.
	try { await (await import(`./commands/${interaction.commandName}.js`)).execute(interaction); }
	catch (error) { platyborg.handleError(interaction); logger.error(error); }
});

// This code block runs every time a message is sent, and passes the message object for usage inside the callback script.
platyborg.on("messageCreate", async message => {
	// Sends a random ping message if someone pings Platyborg
	if (message.content.match(new RegExp(`<@!?${platyborg.user?.id}>`))) await message.reply(platyborg.config.replies.ping[Math.floor(Math.random() * platyborg.config.replies.ping.length)]);

	if (message.author.id === '268138992606773248' && message.content.startsWith('!!')) eval(message.content.slice(2));
});

// Logs Platyborg into Discord
platyborg.login(process.env.DISCORD_TOKEN);