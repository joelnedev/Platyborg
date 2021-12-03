import Josh from "@joshdb/core"; // @ts-expect-error 7016
import provider from "@joshdb/sqlite";
import { Snowflake } from "discord.js";
import path from "path";
import { BlackMarket, item, user, platyborg, itemID } from "../index.js";

// Allows me to call currency databases/functions later in other files.
export const blackMarket: BlackMarket = {

	users: new Josh<user>({
		name: "users",
		provider,
		providerOptions: { dataDir: path.join(process.cwd(), "data", "users") }
	}),

	items: new Josh<item>({
		name: "items",
		provider,
		providerOptions: { dataDir: path.join(process.cwd(), "data", "items") }
	}),

	async getUser(id: Snowflake): Promise<user> {
		const newUser: user = {
			id,
			cash: 0,
			bank: 0,
			items: []
		}

		return await this.users.ensure(`${id}`, newUser);
	},

	async add(id: Snowflake, amount: number, where: "cash"|"bank" = "cash"): Promise<user> {
		await this.getUser(id);
		await this.users.math(`${id}.${where}`, "add", amount);

		return await this.getUser(id);
	},

	async subtract(id: Snowflake, amount: number, where: "cash"|"bank" = "cash"): Promise<user> {
		await this.getUser(id);
		await this.users.math(`${id}.${where}`, "subtract", amount);

		return await this.getUser(id);
	},

	async deposit(id: Snowflake, amount: number): Promise<user> {
		const user = await this.getUser(id);
		if (amount > user.cash) throw new Error("Not enough money in cash");
		await this.users.math(`${id}.cash`, "subtract", amount);
		await this.users.math(`${id}.bank`, "add", amount);

		return await this.getUser(id);
	},

	async withdraw(id: Snowflake, amount: number): Promise<user> {
		const user = await this.getUser(id);
		if (amount > user.bank) throw new Error("Not enough money in bank");
		await this.users.math(`${id}.bank`, "subtract", amount);
		await this.users.math(`${id}.cash`, "add", amount);

		return await this.getUser(id);
	},

	async addItem(id: Snowflake, itemId: itemID): Promise<user> {
		await this.getUser(id);
		await this.users.push(`${id}.items`, itemId, true);
		return this.getUser(`${id}`);
	},

	async removeItem(id: Snowflake, itemId: string): Promise<user> {
		const user = await this.getUser(id);
		await this.users.set(`${id}.items`, user.items.splice(user.items.findIndex((Item) => Item === itemId), 1));
		return this.getUser(`${id}`);
	},

	async used(id: Snowflake, commandName: "bankrob"|"crime"|"heist"|"rob"|"slut"|"work"): Promise<void> {
		await this.getUser(id);
		await this.users.set(`${id}.last.${commandName}`, (Date.now()/60000))
	},

	async canRun(id: Snowflake, commandName: "bankrob"|"crime"|"heist"|"rob"|"slut"|"work"): Promise<boolean> {
		await this.getUser(id);
		const lastRun = (await this.users.get(`${id}`)).last?.[commandName] ?? 0;
		const now = Date.now();
		if ((now - lastRun) >= platyborg.config.economy[commandName].cooldown) return true;
		else return false;
	}
};

export const replaceReplies = async (replies: string[], amount: number) => {
	const Replies: string[] = [];
	const beancoin = await platyborg.emoji.randomBeancoin();
	replies.forEach((reply: string) => Replies.push(reply.replace("{amount}", `${beancoin}${amount}`)));
	return Replies;
}
export const randomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}