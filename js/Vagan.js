var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { blackMarket/* , Client, Interaction */ } from "./util/exports.js";
import { Client as discordClient, MessageEmbed, } from "discord.js";
const Vagan = new discordClient({ intents: [ "GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"], partials: ["MESSAGE", "USER", "REACTION"] });
import config from "./util/info/config.js";
Vagan.config = config;
// const client = new Client(Vagan);
Vagan.showcaseCooldown = new Set;
let availableGuilds = 0;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield blackMarket.users.defer.then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Connected, there are ${yield blackMarket.users.size} rows in the users database.`);
    }));
    yield blackMarket.items.defer.then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Connected, there are ${yield blackMarket.items.size} rows in the items database.`);
    }));
    yield blackMarket.roles.defer.then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Connected, there are ${yield blackMarket.roles.size} rows in the roles database.`);
    }));
}))();
Vagan.on("debug", console.log);
Vagan.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = Vagan.user) === null || _a === void 0 ? void 0 : _a.setActivity("Not responding to commands, currently in debug mode");
    console.log("I'm in.");
    // client.postCommands();
    blackMarket.add("268138992606773248", "5000", "bank").then(user => console.log(user.bank));
}));
Vagan.on("guildCreate", () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    availableGuilds++;
    if (availableGuilds != 2)
        return;
    Vagan.KBC = yield Vagan.guilds.fetch("677965121116700723");
    Vagan.hideout = yield Vagan.guilds.fetch("794303785572237322");
    Vagan.hideout.godModeUsers = (_b = (yield Vagan.hideout.roles.fetch("797151488493223986"))) === null || _b === void 0 ? void 0 : _b.members.array().map(member => member.id);
    Vagan.hideout.logChannel = Vagan.hideout.channels.cache.get("797151756613058600");
    Vagan.handleError = (error, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const embed = new MessageEmbed()
            .setTitle("Error 🚨")
            .setColor("#ff0000")
            .setAuthor(interaction ? interaction === null || interaction === void 0 ? void 0 : interaction.member.displayName : "undefined", interaction ? interaction === null || interaction === void 0 ? void 0 : interaction.author.displayAvatarURL() : '')
            .addField("Error", "An error has occurred.");
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.respond(undefined, { embed: embed
                .setDescription(Vagan.config.replies.error[Math.floor(Math.random() * Vagan.config.replies.error.length)])
                .addField("No action needed", "The dev has already recieved further information.") }));
        Vagan.hideout.logChannel.send(embed.addField("Link:", (_d = (_c = Vagan.user) === null || _c === void 0 ? void 0 : _c.lastMessage) === null || _d === void 0 ? void 0 : _d.url).addField("Error:", error));
        Vagan.emit("debug", error);
    });
    Vagan.emit("debug", `KBC Availability: ${Vagan.KBC.available}`);
    Vagan.emit("debug", `VH Availability: ${Vagan.hideout.available}`);
    Vagan.emit("debug", `VH God Mode Users: ${Vagan.hideout.godModeUsers.join(", ")}`);
    Vagan.emit("debug", `VH Log Channel: ${Vagan.hideout.logChannel.id}`);
}));
Vagan.on("messageReactionAdd", (reaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l;
    let message = reaction.message;
    if (message.channel.id !== "702481578529652796" || message.author.id !== ((_e = Vagan.user) === null || _e === void 0 ? void 0 : _e.id) || reaction.emoji.name !== "⭐")
        return;
    const author = Vagan.KBC.members.cache.find((member) => { var _a; return member.displayName === ((_a = message.embeds[0].author) === null || _a === void 0 ? void 0 : _a.name); });
    const color = (author === null || author === void 0 ? void 0 : author.displayHexColor) || "#FFD966";
    const extension = (attachment) => {
        const imageLink = attachment.split('.');
        const typeOfImage = imageLink[imageLink.length - 1];
        const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
        if (!image)
            return '';
        return attachment;
    };
    const starChannel = yield Vagan.channels.fetch("723973040375070761");
    const fetchedMessages = yield starChannel.messages.fetch({ limit: 100 });
    const stars = fetchedMessages.find(m => { var _a, _b; return m.content.startsWith('⭐') && m.author.id === ((_a = Vagan.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = m.embeds[0].footer) === null || _b === void 0 ? void 0 : _b.text) === message.id; });
    if (stars) {
        const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec((_f = stars.embeds[0].footer) === null || _f === void 0 ? void 0 : _f.text);
        const foundStar = stars.embeds[0];
        const image = message.attachments.size > 0 ? extension(message.attachments.array()[0].url) : '';
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(foundStar.description)
            .setAuthor((_g = foundStar.author) === null || _g === void 0 ? void 0 : _g.name, (_h = foundStar.author) === null || _h === void 0 ? void 0 : _h.url)
            .setTimestamp()
            .setFooter(`${message.id}`)
            .setImage(image)
            .addField("Source", `[Jump!](${message.url})`);
        const starMsg = yield starChannel.messages.fetch(stars.id);
        yield starMsg.edit(`⭐ ${parseInt(star[1]) + 1}`, { embed });
    }
    else {
        const image = message.embeds[0].image ? extension((_j = message.embeds[0].image) === null || _j === void 0 ? void 0 : _j.url) : '';
        message = message.embeds[0];
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(message.description)
            .setAuthor((_k = message.author) === null || _k === void 0 ? void 0 : _k.name, (_l = message.author) === null || _l === void 0 ? void 0 : _l.url)
            .setTimestamp()
            .setFooter(`${reaction.message.id}`)
            .setImage(image)
            .addField("Source", `[Jump!](${reaction.message.url})`);
        !image ? embed.addField("No attachment", "The author didn't attach anything.") : '';
        yield starChannel.send("⭐ 1", { embed });
    }
}));
Vagan.ws.on("INTERACTION_CREATE", (request) => __awaiter(void 0, void 0, void 0, function* () {
    const interaction = new Interaction(Vagan, request);
    try {
        client.matchCommand(interaction);
    }
    catch (error) {
        Vagan.handleError(error, interaction);
    }
}));
Vagan.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    (message.content.toLowerCase().includes("egis") && message.channel.id !== "712991588376117308" && message.author.id !== ((_m = Vagan.user) === null || _m === void 0 ? void 0 : _m.id)) ? yield message.channel.send("egis") : '';
    (message.content.match(new RegExp(`<@!?${(_o = Vagan.user) === null || _o === void 0 ? void 0 : _o.id}> `))) ? yield message.channel.send(Vagan.config.replies.ping[Math.floor(Math.random() * Vagan.config.replies.ping.length)]) : '';
}));
Vagan.login();
