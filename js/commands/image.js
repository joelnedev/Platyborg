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
import { readdirSync } from "fs";
export default new GlobalCommand({
    name: "image",
    description: "Sends a pre-defined image",
    options: [
        {
            name: "image",
            description: "The image to send",
            type: 3,
            required: true,
            choices: [
                {
                    name: "beanos",
                    value: "beanos"
                },
                {
                    name: "kill",
                    value: "kill"
                }
            ]
        }
    ],
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = readdirSync("../util/images");
            const imageIndex = (images.includes(interaction.args[0].value) ? images.findIndex(Image => Image === interaction.args[0].value) : null);
            imageIndex ? yield interaction.respond("\u200b").then(() => { interaction.channel.send(new MessageEmbed().setImage(`../util/images/${images[imageIndex]}`)); }) : yield interaction.respond("Not found 😩", { ephemeral: true });
        });
    },
});
