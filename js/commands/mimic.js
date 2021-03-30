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
import { WebhookClient } from "discord.js";
export default new GlobalCommand({
    name: "mimic",
    description: "Pretend to be another user (like RoboTop's mimic but better because nicknames)",
    options: [
        {
            name: "user",
            description: "User to mimic",
            type: 6,
            required: true
        },
        {
            name: "content",
            description: "What the user should say",
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
            const content = interaction.args.find(arg => arg.name === "content").value;
            const user = yield interaction.bot.users.fetch(interaction.args.find(arg => arg.name === "user").value);
            const anon = interaction.args.find(arg => arg.name === "anonymous").value;
            yield interaction.respond("Working on it...", { ephemeral: true });
            interaction.channel.createWebhook(interaction.bot.KBC.members.cache.get(user.id), {
                avatar: user.displayAvatarURL(),
                reason: `${user.tag} used \`/mimic\``
            }).then((Webhook) => __awaiter(this, void 0, void 0, function* () {
                const webhook = new WebhookClient(Webhook.id, Webhook.token);
                yield webhook.send(content);
                webhook.delete();
            }));
        });
    },
});
