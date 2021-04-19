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
            const currentAmount = (yield blackMarket.users.get(`${interaction.author?.id}`)).cash;
            const transferAmount = command.args.amount;
            const transferTarget = interaction.bot.users.cache.get(command.args.target);
            if (transferAmount > currentAmount) {
                return interaction.respond(undefined, { embed: new MessageEmbed()
                        .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                        .setColor("#FF0000")
                        .setTitle("Invalid amount 🚨")
                        .setDescription(interaction.bot.config.replies.error[Math.floor(Math.random() * interaction.bot.config.replies.error.length)])
                        .addField("Error", `You don't have enough cash. You currently have ${currentAmount}`) });
            }
            if (transferAmount <= 0) {
                return interaction.respond(undefined, { embed: new MessageEmbed()
                        .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                        .setColor("#FF0000")
                        .setTitle("Invalid amount 🚨")
                        .setDescription(interaction.bot.config.replies.error[Math.floor(Math.random() * interaction.bot.config.replies.error.length)])
                        .addField("Error", "You can't transfer a negative amount of money.") });
            }
            yield blackMarket.subtract(interaction.author?.id, transferAmount);
            yield blackMarket.add(transferTarget.id, transferAmount);
            interaction.respond(undefined, { embed: new MessageEmbed()
                    .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                    .setColor("#00FF00")
                    .setTitle("Transfer successful")
                    .setDescription(`Successfully transferred ${transferAmount} to ${transferTarget}. Your current balance is ${(yield blackMarket.users.get(interaction.author?.id)).cash}`) });
        });
    }
};
