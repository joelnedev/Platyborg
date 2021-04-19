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
    name: "info",
    description: "Provides extremely helpful information on users and other things (for more details, use RoboTop)",
    options: [
        {
            name: "user",
            description: "User to get information on",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "User to get information on",
                    type: 6,
                    required: true
                },
                {
                    name: "public",
                    description: "Whether or not to show the message to everyone",
                    type: 5,
                    required: true
                }
            ]
        },
        {
            name: "other",
            description: "Other options to get information on",
            type: 1,
            options: [
                {
                    name: "other",
                    description: "Other options to get information on",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "server",
                            value: "Killer Bean Club"
                        },
                        {
                            name: "shadowbean",
                            value: "Shadow Bean"
                        },
                        {
                            name: "content creator",
                            value: "Content Creator"
                        }
                    ]
                },
                {
                    name: "public",
                    description: "Other options to get information on",
                    type: 5,
                    required: true
                }
            ]
        }
    ],
    execute(interaction) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const values = {
                s: "Killer Bean Club",
                sb: "Shadow Bean",
                cc: "Content Creator"
            };
            let value = (_b = (_a = interaction.args[0].options) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
            let name;
            const resolved = (_d = (_c = interaction.request.data) === null || _c === void 0 ? void 0 : _c.resolved) === null || _d === void 0 ? void 0 : _d.users[value];
            name = resolved ? `${resolved.username}#${resolved.discriminator}` : undefined;
            const embed = new MessageEmbed()
                .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                .setColor("#03b1fc")
                .setTitle(`Info for ${name ? name : values[value]}`);
            switch (value) {
                case "720122607541682199":
                    const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin", "stonorm", "stokenchurch", "stoneromewarm", "stoenwam", "stonenwom", "tenrswom", "stonetoss", "tonestoss", "boneworm", "stonwam"];
                    embed.setDescription(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
                    break;
                case "525333951225528320":
                    embed.setDescription("He is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
                    break;
                case "268138992606773248":
                    embed.setDescription("The best mod in the server, and also my dad (he created me).");
                    break;
                case "766295959700897813":
                    embed.setDescription("I'm Vagan, a character from Killer Bean Forever. (Technically I'm dead but that's not the point.) \n You can see what I can do by typing `/` and browsing through what's listed under my section. (By the way, you can get technical info with `/botinfo`.) ");
                    break;
                case "615720739328491526":
                    embed.setDescription("She is a Shadow Bean and amazing artist (in fact, she drew my profile picture!)");
                    break;
                case "Killer Bean Club":
                    embed.setDescription("Killer Bean Club is a Killer Bean-based server with a close and ever-growing community.");
                    break;
                case "Shadow Bean":
                    embed.setDescription(`To become a Shadow Bean you must:
	• Be at least level 10 on RoboTop xp system
	• Be trusted by all admins
	• Have at least 3 existing shadow beans nominate you for it`);
                    break;
                case "Content Creator":
                    embed.setDescription("To get the Content Creator role, you must send spoons a link to your YouTube or Twitch channel with over 1000 subscribers.");
                    break;
                default:
                    embed.setDescription("What's that? Ask me about someone/something I know.");
            }
            const options = { embed, ephemeral: false };
            ((_e = interaction.args.find(arg => arg.name === "public")) === null || _e === void 0 ? void 0 : _e.value) ? options.ephemeral = false : options.ephemeral = true;
            yield interaction.respond(undefined, options);
        });
    },
});
