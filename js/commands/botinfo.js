var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { blackMarket, GlobalCommand } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
    name: "botinfo",
    description: "Info about me",
    options: [
        {
            name: "public",
            description: "Whether or not to show the message to everyone",
            type: 5,
        }
    ],
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const then = new Date();
            interaction.respond("Pinging...", { ephemeral: true });
            const now = new Date();
            const ping = now.getTime() - then.getTime();
            const Vagan = interaction.bot;
            const embed = new MessageEmbed()
                .setColor("#03b1fc")
                .setTitle('Bot Info')
                .setDescription(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)])
                .addField("Round-trip latency", `${ping}ms`, true)
                .addField("WebSocket heartbeat", `${Vagan.ws.ping}ms`, true)
                .addField("Hosting", "Heroku Hobby Dyno via GitHub Student Developer Pack")
                .addField("Rows of data in Black Market database", `${(yield blackMarket.users.size) + (yield blackMarket.items.size) + (yield blackMarket.roles.size)}`)
                .addField("Profile Picture", "Created by amazing artist <@!615720739328491526>");
            const options = { embed, ephemeral: false };
            options.ephemeral = (_a = interaction.args.find(arg => arg.name === "public")) === null || _a === void 0 ? void 0 : _a.value;
            interaction.respond(undefined, options);
        });
    },
});
