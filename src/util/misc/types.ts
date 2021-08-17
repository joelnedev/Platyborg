import Josh from "@joshdb/core";
import { Client as discordClient, Guild, Snowflake, TextChannel, CommandInteraction } from "discord.js";
import winston from "winston";

interface Hideout extends Guild {
	godModeUsers: Snowflake[],
	logChannel: TextChannel
};

export interface Bot extends discordClient {
	KBC: Guild,
	hideout: Hideout,
	handleError(error: string, interaction: CommandInteraction): void,
	showcaseCooldown: Set<Snowflake>,
	logger: winston.Logger,
	config: {
		replies: {
			error: string[],
			purpose: string[],
			ping: string[],
			ban: string[],
			work: string[],
			slut: {
				win: string[],
				fail: string[],
			}
			crime: {
				win: string[],
				fail: string[],
			},
			rob: {
				win: string[],
				fail: string[],
			}
		},
		economy: {
			work: {
				cooldown: number,
				win: {
					min: number,
					max: number
				}
			},
			slut: {
				cooldown: number,
				win: {
					min: number,
					max: number
				},
				fail: {
					min: number,
					max: number
				},
				failRate: number
			}
			crime: {
				cooldown: number,
				win: {
					min: number,
					max: number
				},
				fail: {
					min: number,
					max: number
				},
				failRate: number
			}
		},
	}
};

export type user = {
	id: Snowflake
	cash: number,
	bank: number,
	items: string[] // string being an item id
};

export type item = {
	id: string,
	name: string,
	description: string,
	cost: number,
	invShow: boolean,
	requiredItems?: string[], // string being an item id
	roleGain?: Snowflake,
	payout?: number,
	winRate?: number,
	gainMessage?: string,
};

export type role = {
	id: Snowflake
	incomeAmount: number,
	incomeInterval: [ amount: number, unit: "hours"|"days" ]
};

export interface BlackMarket {

	/**
	 * All users saved in the database.
	 */
	users: Josh<user>,

	/**
	 * All items saved in the database.
	 */
	items: Josh<item>,

	/**
	 * All roles saved in the database.
	 */
	roles: Josh<role>,

	/**
	 * Add money to a user's cash or bank balance.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @param {"cash"|"bank"} where Add to cash or bank. Default is cash.
	 * @returns `user` object if successful.
	 */
	add(id: Snowflake, amount: number, where?: "cash"|"bank"): Promise<user>,

	/**
	 * Remove money from a user's cash or bank balance.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to remove.
	 * @param {"cash"|"bank"} where Remove from cash or bank. Default is cash.
	 * @returns `user` object if successful.
	 */
	subtract(id: Snowflake, amount: number, where?: "cash"|"bank"): Promise<user>,

	/**
	 * Move money from cash to bank.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @returns `user` object if successful.
	 */
	deposit(id: Snowflake, amount: number): Promise<user|string>,

	/**
	 * Move money from bank to cash.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @returns `user` object if successful.
	 */
	withdraw(id: Snowflake, amount: number): Promise<user|string>,

	/**
	 * Adds an item to a user.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {string} itemId ID of the item to add.
	 * @returns `user` object if successful.
	 */
	addItem(id: Snowflake, itemId: string): Promise<user>,

	/**
	 * Removes an item from a user.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {string} itemId ID of the item to remove.
	 * @returns `user` object if successful.
	 */
	removeItem(id: Snowflake, itemId: string): Promise<user>
};