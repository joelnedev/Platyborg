import Josh from "@joshdb/core";
import { Client as discordClient, Guild, Snowflake, TextChannel, CommandInteraction, GuildEmoji } from "discord.js";
import winston from "winston";

interface Hideout extends Guild {
	godModeUsers: Snowflake[],
};

export interface Bot extends discordClient {
	PFC: Guild,
	hideout: Hideout,
	blackMarket: BlackMarket,
	handleError(interaction: CommandInteraction, error?: string): void,
	logger: winston.Logger,
	emoji: {
		beancoin: Snowflake,
		beancoin_bad: Snowflake,
		beancoin_og: Snowflake,
		beancoinifitwas: Snowflake,
		kbcheck: Snowflake,
		kbx: Snowflake,
		randomBeancoin(): Promise<GuildEmoji>
	},
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
			},
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
			},
			bankrob: {
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
			},
			heist: {
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
			},
			rob: {
				cooldown: number
			}
		},
	}
};

export type itemID = string;

export type user = {
	id: Snowflake
	cash: number,
	bank: number,
	items: itemID[],
	last?: {
		bankrob?: number,
		crime?: number,
		heist?: number,
		rob?: number,
		slut?: number,
		work?: number,
	}
};

export type item = {
	id: itemID,
	name: string,
	description: string,
	cost: number,
	invShow: boolean,
	requiredItems?: itemID[],
	payout?: number,
	winRate?: number,
	gainMessage?: string,
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
	 * Safely get a user entry or create one if it doesn't exist.
	 * @param {Snowflake} id A user's Discord ID.
	 */
	getUser(id: Snowflake): Promise<user>,

	/**
	 * Add money to a user's cash or bank balance.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @param {"cash"|"bank"} where Add to cash or bank. Default is cash.
	 * @returns `user` object.
	 */
	add(id: Snowflake, amount: number, where?: "cash"|"bank"): Promise<user>,

	/**
	 * Remove money from a user's cash or bank balance.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to remove.
	 * @param {"cash"|"bank"} where Remove from cash or bank. Default is cash.
	 * @returns `user` object.
	 */
	subtract(id: Snowflake, amount: number, where?: "cash"|"bank"): Promise<user>,

	/**
	 * Move money from cash to bank.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @returns `user` object.
	 */
	deposit(id: Snowflake, amount: number): Promise<user>,

	/**
	 * Move money from bank to cash.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {number} amount How much to add.
	 * @returns `user` object.
	 */
	withdraw(id: Snowflake, amount: number): Promise<user>,

	/**
	 * Adds an item to a user.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {itemID} itemId ID of the item to add.
	 * @returns `user` object.
	 */
	addItem(id: Snowflake, itemId: itemID): Promise<user>,

	/**
	 * Removes an item from a user.
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {itemID} itemId ID of the item to remove.
	 * @returns `user` object.
	 */
	removeItem(id: Snowflake, itemId: itemID): Promise<user>,

	/**
	 * Saves the last unix time at which a user ran a command (for cooldown purposes).
	 * @param {Snowflake} id A user's Discord ID.
	 * @param {"bankrob"|"crime"|"heist"|"rob"|"slut"|"work"} commandName The command run by the user.
	 */
	used(id: Snowflake, commandName: "bankrob"|"crime"|"heist"|"rob"|"slut"|"work"): Promise<void>,

	/**
	 * Checks whether a user is allowed to run a command (in terms of cooldown).
	 * @param id A user's Discord ID.
	 * @param commandName The command in question.
	 */
	canRun(id: Snowflake, commandName: "bankrob"|"crime"|"heist"|"rob"|"slut"|"work"): Promise<boolean>
};

export type Truth = {
	id: string,
	type: "T",
	question: string
};

export type Dare = {
	id: string,
	type: "D",
	question: string
}

export type NHIE = {
	id: string,
	type: "NHIE",
	question: string
};

export type Paranoia = {
	id: string,
	type: "P",
	question: string
};

export type WYR = {
	id: string,
	type: "WYR",
	question: string
};

export type TOD = Truth | Dare;

export type Question = TOD | NHIE | Paranoia | WYR;

export interface TruthOrDare {

	/**
	 * All questions saved in the database.
	 */
	db: Josh<Question>,

	/**
	 * Add a question to the database.
	 * @param {"T"|"D"|"NHIE"|"P"|"WYR"} type The type of question to be added.
	 * @param {string} question The question to be added.
	 * @returns {boolean} Whether the question was added.
	 */
	addQuestion(type: "NHIE"|"P"|"T"|"D"|"WYR", question: string): Promise<boolean>,

	/**
	 * Get a question by ID.
	 * @param {string} id The ID of the question.
	 * @returns {Question}
	 */
	getByID<T>(id: string): Promise<T|false>,

	/**
	 * Get a random question.
	 * @returns {Question}
	 */
	getRandom(): Promise<Question>,

	/**
	 * Get a random question of a given type.
	 * @param {"T"|"D"|"TD"|"NHIE"|"P"|"WYR"} type The type of question to be returned.
	 * @returns {Question}
	 */
	getRandomByType<T>(type: "NHIE"|"P"|"T"|"TD"|"D"|"WYR"): Promise<T>
}