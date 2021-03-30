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
            const item = yield blackMarket.items.find("name", command.args.target);
            if (!item)
                return interaction.respond("I couldn't find that item.", { ephemeral: true });
            const embed = new MessageEmbed()
                .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
                .setColor("#03b1fc")
                .setTitle(`Info for ${item.name}`)
                .setDescription(`${item.description}`)
                .addField("Cost", `${item.cost}`, true)
                .addField("Required items", (item.requiredItems ? item.requiredItems.join(", ") : "None"), true)
                .addField("Role", (item.roleGain ? `${interaction.bot.KBC.roles.fetch(item.roleGain)}` : "None"), true)
                .addField("Heist", (item.payout ? `Increases heist payout by ${item.payout}%` : item.winRate ? `Increases chance of winning heist by ${item.winRate}%` : "No effect on heists"), true)
                .addField("Inventory item", (item.invShow ? "✅" : "❌"));
            interaction.respond(undefined, { embed });
        });
    }
};
