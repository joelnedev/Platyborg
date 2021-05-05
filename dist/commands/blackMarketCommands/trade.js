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
            const user = yield blackMarket.users.get(interaction.author?.id);
            const target = yield blackMarket.users.get((_a = command.args.target) === null || _a === void 0 ? void 0 : _a.id);
            const item = yield blackMarket.items.find("name", command.args.item);
            const targetItem = {};
            const errorEmbed = new MessageEmbed()
                .setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
                .setColor("FF0000");
            interaction.respond("What item would you like in return?");
            interaction.channel.awaitMessages((m) => (m.author.id === command.args.target.id), { max: 1, time: 30000, errors: ["time"] })
                .then((collected) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                targetItem.h = yield blackMarket.items.find("name", (_b = collected.last()) === null || _b === void 0 ? void 0 : _b.content);
            }));
            if (!item) {
                errorEmbed.setDescription("That item doesn't exist.");
            }
            else if (!user.items.includes(item.name)) {
                errorEmbed.setDescription("You don't have that item.");
            }
            else if (!target.items.includes(targetItem.h.id)) {
                errorEmbed.setDescription("The user you're trying to sell to doesn't have the item you're looking for.");
            }
            else {
                yield command.args.target.send(`${interaction.author?.tag} wants to trade you ${item.name} for ${targetItem.h.name}. Do you accept the transaction? Respond with yes or no within 30 seconds.`);
                command.args.target.DMchannel.awaitMessages((m) => (m.author.id === command.args.target.id) && (m.content.toLowerCase() === ("yes" || "no" || "y" || "n")), { max: 1, time: 30000, errors: ["time"] })
                    .then((collected) => __awaiter(this, void 0, void 0, function* () {
                    const m = collected.last();
                    switch (m === null || m === void 0 ? void 0 : m.content.toLowerCase()) {
                        case "yes":
                        case "y":
                            m === null || m === void 0 ? void 0 : m.author.send("One moment...");
                            interaction.respond(`${m === null || m === void 0 ? void 0 : m.author.tag} has accepted the transaction. One moment...`);
                            user.items.splice(user.items.findIndex((Item) => Item === item.id), 1);
                            target.items.push(item.id);
                            user.items.splice(user.items.findIndex((Item) => Item === targetItem.h.id), 1);
                            target.items.push(targetItem.h.id);
                            interaction.respond("All done.");
                            break;
                        case "no":
                        case "n":
                            m === null || m === void 0 ? void 0 : m.author.send("Transaction was denied.");
                            interaction.respond("The transaction was denied.");
                            break;
                    }
                }))
                    .catch(() => __awaiter(this, void 0, void 0, function* () {
                    command.args.target.send("Time ran out, the transaction was denied.");
                    interaction.respond("They didn't respond in time, the transaction was denied.");
                }));
            }
            if (errorEmbed.description)
                interaction.respond(undefined, { embed: errorEmbed });
        });
    }
};
