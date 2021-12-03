import { blackMarket, platyborg } from "../util/index.js";
import { CommandInteraction, MessageEmbed, version } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const then = new Date();
	await interaction.reply({ content: "Pinging...", ephemeral: true });
	const now = new Date();
	const ping = now.getTime() - then.getTime();
	interaction.deleteReply()
	const embed = new MessageEmbed()
		.setColor(0x03b1fc)
		.setTitle('Bot Info')
		.setDescription(platyborg.config.replies.ping[Math.floor(Math.random() * platyborg.config.replies.ping.length)])
		.addField("Round-trip latency", `${ping}ms`)
		.addField("WebSocket heartbeat", `${platyborg.ws.ping}ms`)
		.addField("Discord.js version", version)
		.addField("Node.js version", process.version)
		// .addField("Hosting", "honestly at this point i have no idea where im gonna host")
		.addField("Rows of data in Black Market databases", `${await blackMarket.users.size + await blackMarket.items.size}`)
		.addField("Profile Picture", "Created by amazing artist <@!615720739328491526>");
	interaction.followUp({ embeds: [embed], ephemeral: !interaction.options.getBoolean("public")! });
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
