var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InteractionResponseFlags } from "./types";
export default class Interaction {
    constructor(bot, request) {
        var _a;
        this.bot = bot;
        this.request = request;
        this.args = (_a = request.data) === null || _a === void 0 ? void 0 : _a.options;
        this.responded = false;
        this.deferred = false;
    }
    get guild() {
        return this.bot.guilds.cache.get(this.request.guild_id);
    }
    get channel() {
        return this.bot.channels.cache.get(this.request.channel_id);
    }
    get botMember() {
        return this.guild.members.cache.get(this.bot.user.id);
    }
    get author() {
        return this.bot.users.cache.get(this.request.member.user.id);
    }
    get member() {
        return this.guild.members.cache.get(this.request.member.user.id);
    }
    respond(content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: 4,
                data: {
                    content: undefined,
                    embeds: undefined,
                    flags: undefined,
                    allowed_mentions: undefined
                }
            };
            payload.data.content = content ? content : '';
            payload.data.flags = (options === null || options === void 0 ? void 0 : options.ephemeral) && !this.deferred ? InteractionResponseFlags.EPHEMERAL : undefined;
            payload.data.embeds = (options === null || options === void 0 ? void 0 : options.embed) ? [options.embed.toJSON()] : [];
            payload.data.allowed_mentions = (options === null || options === void 0 ? void 0 : options.stripMentions) ? { parse: ["users"] } : undefined;
            if (this.deferred) {
                this.bot.api.webhooks(this.bot.user.id, this.request.token).messages('@original').patch(payload);
                this.deferred = false;
                this.responded = true;
            }
            else if (!this.responded) {
                yield this.bot.api.interactions(this.request.id, this.request.token).callback.post(payload);
                this.responded = true;
            }
            else {
                yield this.bot.api.webhooks(this.bot.user.id, this.request.token).post(payload);
            }
            return Object.assign({}, payload);
        });
    }
    defer(ephemeral) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { type: 5, data: {} };
            payload.data.flags = ephemeral ? InteractionResponseFlags.EPHEMERAL : undefined;
            yield this.bot.api.interactions(this.request.id, this.request.token).callback.post(payload);
            this.deferred = true;
            setTimeout(() => { if (!this.responded)
                throw new Error("Interaction timed out."); }, 900000);
            return payload;
        });
    }
}
