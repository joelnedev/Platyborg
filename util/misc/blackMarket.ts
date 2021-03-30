import { BlackMarket, user, item, role } from "./types";
import { Snowflake } from "discord.js";

// Allows me to call currency databases/functions later in the file.
import Josh from "@joshdb/core"; // @ts-expect-error
import provider from "@joshdb/mongo";
export const blackMarket: BlackMarket = {
	users: new Josh<user>({
		name: "users",
		provider, // @ts-expect-error
		providerOptions: {
			collection: "vagansvault",
			url: process.env.MONGO_URL
		}
	}),

	items: new Josh<item>({
		name: "items",
		provider, // @ts-expect-error
		providerOptions: {
			collection: "vagansvault",
			url: process.env.MONGO_URL
		}
	}),

	roles: new Josh<role>({
		name: "roles",
		provider, // @ts-expect-error
		providerOptions: {
			collection: "vagansvault",
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

	async addItem(id: Snowflake, itemID: number): Promise<user> {
		await blackMarket.users.push(`${id}.items`, itemID, true);
		return blackMarket.users.get(`${id}`);
	}
};