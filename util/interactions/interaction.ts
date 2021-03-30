import { Guild, GuildMember, User, TextChannel, MessageEmbed, DMChannel } from 'discord.js';
import { Bot } from '../exports';
import { Interaction as Request, InteractionResponseFlags, Payload } from "./types";

export default class Interaction {

	public bot: Bot;
	public request: Request;
	public args: {
		name: string,
		value?: any,
		options?: {
			name: string,
			value?: any,
			options?: {
				name: string,
				value: any
			}[]
		}[]
	}[];

	private responded: boolean;
	private deferred: boolean;

	constructor(bot: Bot, request: Request) {
		this.bot = bot;
		this.request = request; // @ts-expect-error
		this.args = request.data?.options;
		this.responded = false;
		this.deferred = false;
	}

	public get guild(): Guild { // @ts-expect-error
		return this.bot.guilds.cache.get(this.request.guild_id);
	}


	public get channel(): TextChannel { // @ts-expect-error
		return this.bot.channels.cache.get(this.request.channel_id);
	}

	public get botMember(): GuildMember { // @ts-expect-error
		return this.guild.members.cache.get(this.bot.user.id);
	}

	public get author(): User { // @ts-expect-error
		return this.bot.users.cache.get(this.request.member.user.id);
	}

	public get member(): GuildMember { // @ts-expect-error
		return this.guild.members.cache.get(this.request.member.user.id);
	}


	/**
	 * Responds to the interaction
	 * @param {string} content Message content to send
	 * @param {MessageEmbed} embed A valid MessageEmbed object
	 * @param {boolean} ephemeral Pass `true` if message should only be viewable to the user who invoked the command
	 */
	public async respond(content?: string, options?: { ephemeral?: boolean, embed?: MessageEmbed, stripMentions?: boolean }) {
		const payload: Payload = {
			type: 4,
			data: {
				content: undefined,
				embeds: undefined,
				flags: undefined,
				allowed_mentions: undefined
			}
		}
		payload.data.content = content ? content : '';
		payload.data.flags = options?.ephemeral && !this.deferred ? InteractionResponseFlags.EPHEMERAL : undefined;
		payload.data.embeds = options?.embed ? [ options.embed.toJSON() ] : [];
		payload.data.allowed_mentions = options?.stripMentions ? { parse: [ "users" ] } : undefined;

		if (this.deferred) { // @ts-expect-error
			this.bot.api.webhooks(this.bot.user.id, this.request.token).messages('@original').patch(payload);
			this.deferred = false;
			this.responded = true;
		} else if (!this.responded) { // @ts-expect-error
			await this.bot.api.interactions(this.request.id, this.request.token).callback.post(payload);
			this.responded = true;
		} else { // @ts-expect-error
			await this.bot.api.webhooks(this.bot.user.id, this.request.token).post(payload);
		}
		return { ...payload };
	}

	/**
	 * Defer responding to the interaction for up to 15 minutes
	 * @param {boolean} ephemeral Pass true if message should only be viewable to the user who invoked the command
	 */
	public async defer(ephemeral: boolean) {
		const payload: Payload = { type: 5, data: {} }
		payload.data.flags = ephemeral ? InteractionResponseFlags.EPHEMERAL : undefined;

		// @ts-expect-error
		await this.bot.api.interactions(this.request.id, this.request.token).callback.post(payload);
		this.deferred = true;
		setTimeout(() => { if (!this.responded) throw new Error("Interaction timed out.") }, 900000);
		return payload;
	}
}