import { GlobalCommand } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
    name: "ping",
    description: "Ping!",
    execute(interaction) {
        let then = new Date();
        interaction.respond("Pinging...", { ephemeral: true });
        let now = new Date();
        let ping = now.getTime() - then.getTime();
        const embed = new MessageEmbed()
            .setColor("#03b1fc")
            .setTitle("Pong")
            .setDescription(interaction.bot.config.replies.ping[Math.floor(Math.random() * interaction.bot.config.replies.ping.length)])
            .addField("Ping (ms)", ping);
        interaction.respond(undefined, { ephemeral: false, embed });
    },
});
