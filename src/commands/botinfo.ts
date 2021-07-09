import { blackMarket, Vagan } from "../util/exports.js";
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from "discord.js";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	const then = new Date();
	interaction.reply({ content: "Pinging...", ephemeral: true });
	const now = new Date();
	const ping = now.getTime() - then.getTime();
	const embed = new MessageEmbed()
		.setColor("#03b1fc")
		.setTitle('Bot Info')
		.setDescription(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)])
		.addField("Round-trip latency", `${ping}ms`, true)
		.addField("WebSocket heartbeat", `${Vagan.ws.ping}ms`, true)
		.addField("Hosting", "Heroku Hobby Dyno via GitHub Student Developer Pack")
		.addField("Rows of data in Black Market databases", `${await blackMarket.users.size + await blackMarket.items.size + await blackMarket.roles.size}`)
		.addField("Profile Picture", "Created by amazing artist <@!615720739328491526>");
	interaction.webhook.send({ embeds: [embed], ephemeral: interaction.options.find(arg => arg.name === "public")?.value as boolean });
}
command.help = {
	name: "botinfo",
	description: "Info about me",
	options: [
		{
			name: "public",
			description: "Whether or not to show the message to everyone",
			type: 5,
		}
	]
}
