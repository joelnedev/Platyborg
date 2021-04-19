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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield blackMarket.items.find("name", command.args.target);
            const user = yield blackMarket.users.get(interaction.author?.id);
            const embed = new MessageEmbed()
                .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL());
            if (!item) {
                embed.setDescription("I couldn't find that item.");
                embed.setColor("#FF0000");
            }
            else if (item.cost > user.cash) {
                embed.setDescription(`You don't have enough cash to buy ${item.name}`);
                embed.setColor("#FF0000");
            }
            else if ((_a = item.requiredItems) === null || _a === void 0 ? void 0 : _a.every(Item => user.items.includes(Item))) {
                const requiredItems = [];
                item.requiredItems.forEach((Item) => __awaiter(this, void 0, void 0, function* () { return requiredItems.push((yield blackMarket.items.get(Item)).name); }));
                embed.setDescription(`You don't have the required item(s). To craft this, you need: ${requiredItems.join(", ")}`);
                embed.setColor("FF0000");
            }
            else if (item.invShow) {
                yield blackMarket.users.push("items", item.id, false);
                yield blackMarket.subtract(interaction.author?.id, item.cost);
                if (item.requiredItems) {
                    item.requiredItems.forEach((Item) => __awaiter(this, void 0, void 0, function* () { return yield blackMarket.users.remove(`${interaction.author?.id}.items`, Item); }));
                }
                embed.setColor("00FF00");
                embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
            }
            else {
                embed.setColor("00FF00");
                embed.setDescription(item.gainMessage ? item.gainMessage : `You now have ${item.name}. Thanks for the business.`);
                if (item.roleGain) {
                    interaction.member?.roles.add(item.roleGain);
                }
            }
            interaction.respond(undefined, { embed });
        });
    }
};
