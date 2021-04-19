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
export default new GlobalCommand({
    name: "say",
    description: "Say what you say to say",
    options: [
        {
            name: "content",
            description: "What the bot should say",
            type: 3,
            required: true
        },
        {
            name: "anonymous",
            description: "Whether to show your input publicly",
            type: 5,
            required: true
        }
    ],
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = interaction.args.find(arg => arg.value === "content").value;
            const anonSay = () => __awaiter(this, void 0, void 0, function* () {
                yield interaction.respond("ok", { ephemeral: true });
                yield interaction.channel.send(content);
                interaction.bot.channels.cache.get("688757903905259580").send(`${interaction.author?.tag} said: \n \`${content}\``);
            });
            interaction.args.find(arg => arg.name === "anonymous").value === false ? yield interaction.respond(content, { stripMentions: true }) : anonSay();
        });
    },
});
