import { GlobalCommand } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
    name: "ban",
    description: "Pretends to ban someone",
    execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle("Baned!")
            .setColor("#00ff00")
            .setDescription(interaction.bot.config.replies.ban[Math.floor(Math.random() * interaction.bot.config.replies.ban.length)])
            .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
            .setFooter("Nobody was baned in the makeing of this joek");
        interaction.respond(undefined, { embed });
    },
});
