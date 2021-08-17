import { blackMarket, Vagan } from "../util/exports.js";
import { CommandInteraction, MessageEmbed, version } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const then = new Date();
	interaction.reply({ content: "Pinging...", ephemeral: true });
	const now = new Date();
	const ping = now.getTime() - then.getTime();
	const embed = new MessageEmbed()
		.setColor(0x03b1fc)
		.setTitle('Bot Info')
		.setDescription(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)])
		.addField("Round-trip latency", `${ping}ms`, true)
		.addField("WebSocket heartbeat", `${Vagan.ws.ping}ms`, true)
		.addField("Discord.js version", version, true)
		.addField("Node.js version", process.version, true)
		.addField("Hosting", "Linode 2GB")
		.addField("Rows of data in Black Market databases", `${await blackMarket.users.size + await blackMarket.items.size + await blackMarket.roles.size}`)
		.addField("Profile Picture", "Created by amazing artist <@!615720739328491526>");
	interaction.followUp({ embeds: [embed], ephemeral: interaction.options.getBoolean("public")! });
}
export const help = {
	name: "botinfo",
	description: "Info about me",
	options: [
		{
			name: "public",
			description: "Whether or not to show the message to everyone",
			type: ApplicationCommandOptionType.Boolean,
		}
	]
}
