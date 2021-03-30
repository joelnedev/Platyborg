import { GlobalCommand } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
    name: "advertising",
    description: "Becomes spoons and commits murder over self advertising",
    execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle("Self Advertising")
            .setColor("#03b1fc")
            .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
            .setDescription("We don’t currently allow self advertisement in this server for several reasons: \n- It devalues our partners \n- People could advertise malicious content (and we can’t make exceptions for servers with good intent) \n- People swarm here just to advertise, and it’s kinda dumb \n \n So apart from our partnered servers, Killer Bean-related social media content, and anything directly approved by spoons, you may not self advertise or advertise in this server. (Note: as mentioned, you can get prior approval from the owner.) Thanks for understanding.");
        interaction.respond(undefined, { embed });
    },
});
