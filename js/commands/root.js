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
import { restart } from "pm2";
export default new GlobalCommand({
    name: "root",
    description: "A number of functions that can only be run by god mode users",
    options: [
        {
            name: "function",
            description: "Function to run",
            type: 3,
            required: true
        },
        {
            name: "arg0",
            description: "in case the function needs args",
            type: 3,
            required: false
        }
    ],
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const Vagan = interaction.bot;
            if (!Vagan.hideout.godModeUsers.includes(interaction.author.id) || interaction.author.id !== "spoons id") {
                const fail = ["nawwyaintfr", "noyoucannotpossiblyserious", "trolort", "nah", "fail", "failure", "you arent the boss of me >:(((((", "yo mama", "roflcopter", "no", "stop", "die", "i am going to cry"];
                return interaction.respond(fail[Math.floor(Math.random() * fail.length)], { ephemeral: true });
            }
            const tempStorage = {};
            const func = yield interaction.args.find((arg) => arg.name === "function").value.toLowerCase();
            switch (func) {
                case "reboot":
                    yield interaction.respond("rebooting :grin::+1:", { ephemeral: true });
                    tempStorage.func = "reboot";
                    break;
                case "eval":
                    try {
                        const code = interaction.args.find((arg) => arg.name === "arg0").value;
                        let evaled = eval(code);
                        tempStorage.arg0 = code;
                        if (code.includes("token")) {
                            tempStorage.arg0 = "tried to get the bot token";
                            return interaction.respond("no.", { ephemeral: true });
                        }
                        if (typeof evaled !== "string")
                            evaled = require("util").inspect(evaled);
                        yield interaction.respond(`\`\`\`xl\n${evaled}\n\`\`\``, { ephemeral: true });
                    }
                    catch (err) {
                        yield interaction.respond(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``, { ephemeral: true });
                    }
                    break;
                case "additem":
                    tempStorage.addItem = {
                        name: interaction.args.find((arg) => arg.name === "arg0").value
                    };
                    yield interaction.respond(`ok sp**on. set more properties for ${tempStorage.addItem.itemName}`);
                    yield interaction.respond("give me a 10 character item id. this is basically shorthand for the name, it's used for storage and isnt revealed to the end user. dont put a space though. (you have 60 seconds to respond)");
                    interaction.channel.awaitMessages((m) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        yield interaction.respond(`setting \`id\` to \`${(_a = collected.last()) === null || _a === void 0 ? void 0 : _a.content}\``);
                        tempStorage.id = (_b = collected.last()) === null || _b === void 0 ? void 0 : _b.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long. database hasnt been modified yet, run the command again"); }));
                    if (!tempStorage.id)
                        return;
                    yield interaction.respond("next is description. give a sentence or two explaining the item. obviously, it will be revealed to the end user. you get 60 seconds again.");
                    interaction.channel.awaitMessages((m) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _c, _d;
                        yield interaction.respond(`setting \`description\` to \`${(_c = collected.last()) === null || _c === void 0 ? void 0 : _c.content}\``);
                        tempStorage.addItem.description = (_d = collected.last()) === null || _d === void 0 ? void 0 : _d.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long. database hasnt been modified yet, run the command again"); }));
                    if (!tempStorage.addItem.description)
                        return;
                    yield interaction.respond("how much does the item cost? give me a valid number equal to or greater than 1 or you will ruin every command that uses this item. 1 minute instead of 60 seconds this time, starting now.");
                    interaction.channel.awaitMessages((m) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _e, _f;
                        yield interaction.respond(`setting \`cost\` to \`${(_e = collected.last()) === null || _e === void 0 ? void 0 : _e.content}\``);
                        tempStorage.addItem.cost = (_f = collected.last()) === null || _f === void 0 ? void 0 : _f.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long. database hasnt been modified yet, run the command again"); }));
                    if (!tempStorage.addItem.cost)
                        return;
                    yield interaction.respond("should the item be shown in users' inventory?!?!?! only say yes if this item should be a heist powerup or vanity thing like plasmablade (more item functionality coming soon), respond with 'true' or 'false' within a minute.");
                    interaction.channel.awaitMessages((m) => m.author.id === interaction.author.id, { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _g, _h;
                        yield interaction.respond(`setting \`invShow\` to \`${(_g = collected.last()) === null || _g === void 0 ? void 0 : _g.content}\``);
                        tempStorage.addItem.invShow = (_h = collected.last()) === null || _h === void 0 ? void 0 : _h.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long. database hasnt been modified yet, run the command again"); }));
                    if (!tempStorage.addItem.invShow)
                        return;
                    yield interaction.respond("next properties are optional. if you dont want to set one, respond with 'none' or wait for time to expire");
                    yield interaction.respond("set the required items if this is a crafted item. separate item names by spaces (if the item name has a space, leave it out and let juh know)");
                    interaction.channel.awaitMessages((m) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _j, _k;
                        yield interaction.respond(`setting \`requiredItems\` to \`${(_j = collected.last()) === null || _j === void 0 ? void 0 : _j.content}\``);
                        const requiredItems = [];
                        (_k = collected.last()) === null || _k === void 0 ? void 0 : _k.content.split(" ").forEach((item) => __awaiter(this, void 0, void 0, function* () { return requiredItems.push((yield blackMarket.items.find("name", item)).id); }));
                        tempStorage.addItem.requiredItems = requiredItems;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long or said `none`. property has not been set"); }));
                    yield interaction.respond("what should Vagan say when the user buys the item? obviously maximum is 2000 characters but why would you do that");
                    interaction.channel.awaitMessages((m) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _l, _m;
                        yield interaction.respond(`setting \`gainMessage\` to \`${(_l = collected.last()) === null || _l === void 0 ? void 0 : _l.content}\``);
                        tempStorage.addItem.gainMessage = (_m = collected.last()) === null || _m === void 0 ? void 0 : _m.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long or said `none`. property has not been set"); }));
                    yield interaction.respond("what role should users get when they buy the item? send a role ID (not the name, not a ping, but the id) or the bot will go nuts");
                    interaction.channel.awaitMessages((m) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _o, _p;
                        yield interaction.respond(`setting \`roleGain\` to \`${(_o = collected.last()) === null || _o === void 0 ? void 0 : _o.content}\``);
                        tempStorage.addItem.roleGain = (_p = collected.last()) === null || _p === void 0 ? void 0 : _p.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long or said `none`. property has not been set"); }));
                    yield interaction.respond("if this is a heist powerup, should it give a payout boost? for example, if you send `1.5`, using this item in a heist will give/take 50% more money.");
                    interaction.channel.awaitMessages((m) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _q, _r;
                        yield interaction.respond(`setting \`payout\` to \`${(_q = collected.last()) === null || _q === void 0 ? void 0 : _q.content}\``);
                        tempStorage.addItem.payout = (_r = collected.last()) === null || _r === void 0 ? void 0 : _r.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long or said `none`. property has not been set"); }));
                    yield interaction.respond("if this is a heist powerup, should it give a higher chance of winning? this will be subtracted from the crime fail rate of 45%. for example, if you send `10`, the chance of losing will be 35% when used in a heist.");
                    interaction.channel.awaitMessages((m) => (m.author.id === interaction.author.id) || (m.content.toLowerCase() !== "none"), { max: 1, time: 60000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        var _s, _t;
                        yield interaction.respond(`setting \`payout\` to \`${(_s = collected.last()) === null || _s === void 0 ? void 0 : _s.content}\``);
                        tempStorage.addItem.payout = (_t = collected.last()) === null || _t === void 0 ? void 0 : _t.content;
                    }))
                        .catch(() => __awaiter(this, void 0, void 0, function* () { return yield interaction.respond("you took too long or said `none`. property has not been set"); }));
                    try {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            if (blackMarket.items.has(tempStorage.id) || blackMarket.items.find("name", tempStorage.additem.name)) {
                                throw new Error("Item already exists");
                            }
                            else {
                                yield blackMarket.items.set(tempStorage.id, Object.assign({ id: tempStorage.id }, tempStorage.addItem));
                                yield Vagan.hideout.logChannel.send(`${interaction.author.tag} created item "${tempStorage.addItem.name}":`);
                                Vagan.emit("debug", `${interaction.author.tag} created item "${tempStorage.addItem.name}":`);
                                const embed = new MessageEmbed();
                                for (const key in tempStorage.addItem) {
                                    embed.addField(key, tempStorage.addItem[key]);
                                    Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
                                }
                                Vagan.hideout.logChannel.send(embed);
                            }
                        }))();
                    }
                    catch (err) {
                        Vagan.handleError(err, interaction);
                        yield Vagan.hideout.logChannel.send(`${interaction.author.tag} tried to create item "${tempStorage.addItem.name}":`);
                        Vagan.emit("debug", `${interaction.author.tag} tried to create item "${tempStorage.addItem.name}":`);
                        const embed = new MessageEmbed();
                        for (const key in tempStorage.addItem) {
                            embed.addField(key, tempStorage.addItem[key]);
                            Vagan.emit("debug", `\n ${key}: ${tempStorage.addItem[key]}`);
                        }
                        yield Vagan.hideout.logChannel.send(embed);
                    }
                    finally {
                        interaction.respond("Everything is finished. You may have received an error, in which case you should wait for jojo bot to get back to you before trying again.");
                    }
                    break;
                default:
                    return interaction.respond("Not a function :face_with_raised_eyebrow:", { ephemeral: true });
            }
            const sendMe = new Array();
            sendMe.push(`${interaction.author.tag} used root function \`${tempStorage.func}\``);
            if (tempStorage.arg0) {
                sendMe.push(`Arg0: ${tempStorage.arg0}`);
            }
            yield Vagan.hideout.logChannel.send(sendMe.join("\n"));
            if (tempStorage.func === "reboot") {
                restart("all", () => console.log(`Vagan restarted by ${interaction.author.tag}`));
            }
        });
    },
});
