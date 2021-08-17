import Josh from "@joshdb/core"; // @ts-expect-error 7016
import provider from "@joshdb/mongo";
import { GuildEmoji, Snowflake } from "discord.js";
import { BlackMarket, item, role, user, Vagan } from "../exports.js";

// Allows me to call currency databases/functions later in the file.
export const blackMarket: BlackMarket = {
	
	users: new Josh<user>({
		name: "users",
		provider,
		providerOptions: {
			collection: "VagansVaultUsers",
			url: process.env.MONGO_URL
		}
	}),

	items: new Josh<item>({
		name: "items",
		provider,
		providerOptions: {
			collection: "VagansVaultItems",
			url: process.env.MONGO_URL
		}
	}),

	roles: new Josh<role>({
		name: "roles",
		provider,
		providerOptions: {
			collection: "VagansVaultRoles",
			url: process.env.MONGO_URL
		}
	}),

	async add(id: Snowflake, amount: number, where: "cash"|"bank" = "cash"): Promise<user> {
		const newUser: user = {
			id: id,
			cash: 0,
			bank: 0,
			items: []
		}
		await blackMarket.users.ensure(`${id}`, newUser);
		await blackMarket.users.math(`${id}.${where}`, "add", amount);

		const User = await blackMarket.users.get(id);
		return User;
	},

	async subtract(id: Snowflake, amount: number, where: "cash"|"bank" = "cash"): Promise<user> {
		const newUser: user = {
			id: id,
			cash: 0,
			bank: 0,
			items: []
		}
		await blackMarket.users.ensure(id, newUser);
		await blackMarket.users.math(`${id}.${where}`, "subtract", amount);

		const User = await blackMarket.users.get(id);
		return User;
	},

	async deposit(id: Snowflake, amount: number): Promise<user|string> {
		const user = await blackMarket.users.get(id);
		if (amount > user.cash) return "Not enough money in cash";
		await blackMarket.users.math(`${id}.cash`, "subtract", amount);
		await blackMarket.users.math(`${id}.bank`, "add", amount);

		const User = await blackMarket.users.get(id);
		return User;
	},

	async withdraw(id: Snowflake, amount: number): Promise<user|string> {
		const user = await blackMarket.users.get(id);
		if (amount > user.bank) return "Not enough money in bank";
		await blackMarket.users.math(`${id}.bank`, "subtract", amount);
		await blackMarket.users.math(`${id}.cash`, "add", amount);

		const User = await blackMarket.users.get(id);
		return User;
	},

	async addItem(id: Snowflake, itemId: string): Promise<user> {
		await blackMarket.users.push(`${id}.items`, itemId, true);
		return blackMarket.users.get(`${id}`);
	},

	async removeItem(id: Snowflake, itemId: string): Promise<user> {
		const User = await blackMarket.users.get(id);
		await blackMarket.users.set(`${id}.items`, User.items.splice(User.items.findIndex((Item) => Item === itemId), 1));
		return blackMarket.users.get(`${id}`);
	}
};

export const replaceReplies = (replies: string[], amount: number) => {
	const Replies: string[] = [];
	replies.forEach( (reply: string) => {
		const emoji = (id: Snowflake): GuildEmoji => { return Vagan.emojis.cache.get(id) as GuildEmoji; }
		const emojis: GuildEmoji[] = [];
		[817125266593808435n, 817125375699845171n, 817125438110826547n, 817125529555697735n].forEach(emojiId => emojis.push(emoji(`${emojiId}`)));
		Replies.push(reply.replace("{amount}", `${emojis[Math.floor(Math.random() * emojis.length)]}${amount}`));
	});
	return Replies;
}
export const randomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}