var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalCommand } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
    name: "post",
    description: "Show off your epic talent in #showcase",
    options: [{
            name: "attachment",
            description: "Indicates whether you're going to send an attachment or not",
            type: 5,
            required: true
        },
        {
            name: "caption",
            description: "A caption to send along with your post",
            type: 3,
            required: false
        }
    ],
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.bot.showcaseCooldown.has(interaction.author.id)) {
                interaction.author.send("You can post one showcase every 5 minutes. To discuss a showcase, use the appropriate channel (or sopones wil bane you)");
                return;
            }
            const caption = interaction.args.find(arg => arg.name === "caption").value;
            const embed = new MessageEmbed()
                .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
                .setColor(interaction.member.displayHexColor)
                .setTitle(`Showcase by ${interaction.author}`)
                .setFooter("If you want to post your own showcase, go to any channel and type `/post` ")
                .setTimestamp()
                .setDescription(caption ? caption : "The author didn't add a caption");
            if (interaction.args.find(arg => arg.name === "attachment")) {
                yield interaction.author.send("Send your attachment here.").catch(() => { return interaction.respond("You'll need to allow DMs from me to include an attachment.", { ephemeral: true }); });
                (_a = interaction.author.dmChannel) === null || _a === void 0 ? void 0 : _a.awaitMessages(m => m.author.id === interaction.author.id).then(collected => {
                    embed.setImage(collected.last().attachments.last().proxyURL);
                });
            }
            else {
                embed.addField("No attachment", "The author didn't attach anything");
            }
            interaction.respond("Posted!", { ephemeral: true });
            interaction.bot.channels.cache.get("702481578529652796").send(embed);
            if (!interaction.bot.hideout.godModeUsers.includes(interaction.author.id)) {
                interaction.bot.showcaseCooldown.add(interaction.author.id);
                setTimeout(() => {
                    interaction.bot.showcaseCooldown.delete(interaction.author.id);
                }, 300000);
            }
        });
    },
});
