var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { blackMarket } from "../../util/exports.js";
import { MessageEmbed } from "discord.js";
export default {
    execute(interaction, command) {
        return __awaiter(this, void 0, void 0, function* () {
            const Vagan = interaction.bot;
            const config = Vagan.config.economy.crime;
            let fail = () => Math.random() * config.failRate;
            let add = command.tools.randomNumber(config.win.min, config.win.max);
            let remove = command.tools.randomNumber(config.fail.min, config.fail.max);
            const winReplies = command.tools.replaceReplies(Vagan.config.replies.crime.win, add);
            const failReplies = command.tools.replaceReplies(Vagan.config.replies.crime.fail, remove);
            interaction.respond("What item would you like to use?");
            interaction.channel.awaitMessages(m => m.author.id === interaction.author?.id, { max: 1, time: 30000, errors: ["time"] })
                .then((collected) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const user = yield blackMarket.users.get(interaction.author?.id);
                const item = (_a = collected.last()) === null || _a === void 0 ? void 0 : _a.content.toLowerCase();
                const storedItem = yield blackMarket.items.find("name", item);
                if (!storedItem) {
                    return interaction.respond("That item doesn't exist.");
                }
                else if (!user.items.some((userItem) => userItem.name.toLowerCase() === item)) {
                    return interaction.respond("You don't have that item.");
                }
                else if (!storedItem.payout || !storedItem.winRate) {
                    return interaction.respond("That item can't be used for this.");
                }
                else if (storedItem.payout) {
                    add += add * storedItem.payout;
                    remove += remove * storedItem.payout;
                }
                else if (storedItem.winRate) {
                    fail = () => Math.random() * (config.failRate - storedItem.winRate);
                }
            }))
                .catch(() => {
                return interaction.respond("You took too long.");
            });
            const failed = fail();
            failed > 0.5 ? yield blackMarket.add(interaction.author?.id, add) : yield blackMarket.subtract(interaction.author?.id, remove);
            const embed = new MessageEmbed()
                .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                .setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
                .setColor(failed > 0.5 ? "00FF00" : "FF0000");
            interaction.respond(undefined, { embed });
        });
    }
};
