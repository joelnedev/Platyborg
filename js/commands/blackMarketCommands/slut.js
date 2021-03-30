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
            const config = Vagan.config.economy.slut;
            const fail = () => Math.random() * config.failRate;
            const failed = fail();
            const add = command.randomNumber(config.win.min, config.win.max);
            const remove = command.randomNumber(config.fail.min, config.fail.max);
            const winReplies = command.replaceReplies(Vagan.config.replies.slut.win, add);
            const failReplies = command.replaceReplies(Vagan.config.replies.slut.fail, remove);
            failed > 0.5 ? yield blackMarket.add(interaction.author.id, add) : yield blackMarket.subtract(interaction.author.id, remove);
            const embed = new MessageEmbed()
                .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
                .setDescription(failed > 0.5 ? winReplies[Math.floor(Math.random() * winReplies.length)] : failReplies[Math.floor(Math.random() * failReplies.length)])
                .setColor(failed > 0.5 ? "00FF00" : "FF0000");
            interaction.respond(undefined, { embed });
        });
    }
};
