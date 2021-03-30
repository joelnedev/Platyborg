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
            const config = Vagan.config.economy.work;
            const add = command.randomNumber(config.win.min, config.win.max);
            const replies = command.replaceReplies(Vagan.config.replies.work, add);
            yield blackMarket.users.math(`${interaction.author.id}.cash`, "add", add);
            const embed = new MessageEmbed()
                .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
                .setDescription(replies[Math.floor(Math.random() * replies.length)])
                .setColor("#00FF00");
            interaction.respond(undefined, { embed });
        });
    }
};
