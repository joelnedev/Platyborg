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
            const user = yield blackMarket.users.get(interaction.author.id);
            const embed = new MessageEmbed()
                .setAuthor(interaction.member.displayName, interaction.author.displayAvatarURL())
                .setColor("#03b1fc");
            if (!user.items.length)
                return interaction.respond(undefined, { embed: embed.setDescription("You don't have anything in your inventory.") });
            const inventory = [];
            user.items.forEach((itemID) => __awaiter(this, void 0, void 0, function* () {
                inventory.push((yield blackMarket.items.get(itemID)).name);
            }));
            interaction.respond(undefined, { embed: embed.addField("Inventory", inventory.join(",\n")) });
        });
    }
};
