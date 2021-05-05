import { blackMarket, GlobalCommand, Interaction } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
	name: "botinfo",
	description: "Info about me",
	options: [
		{
			name: "public",
			description: "Whether or not to show the message to everyone",
			type: 5,
		}
	],
	async execute(interaction: Interaction) {
		const then = new Date();
		interaction.respond("Pinging...", { ephemeral: true });
		const now = new Date();
		const ping = now.getTime() - then.getTime();
		const Vagan = interaction.bot;
		const embed = new MessageEmbed()
			.setColor("#03b1fc")
			.setTitle('Bot Info')
			.setDescription(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)])
			.addField("Round-trip latency", `${ping}ms`, true)
			.addField("WebSocket heartbeat", `${Vagan.ws.ping}ms`, true)
			.addField("Hosting", "Heroku Hobby Dyno via GitHub Student Developer Pack")
			.addField("Rows of data in Black Market databases", `${await blackMarket.users.size + await blackMarket.items.size + await blackMarket.roles.size}`)
			.addField("Profile Picture", "Created by amazing artist <@!615720739328491526>");
		const options = { embed, ephemeral: false };
		options.ephemeral = interaction.args.find(arg => arg.name === "public")?.value;
		interaction.respond(undefined, options);
	},
});