// This package is based on the one built by xlyr.on; it has been archived so I am making a fork that's modified specifically for Vagan.

import { Interaction } from "./slash";
import { Client, Snowflake } from "discord.js";
import { ApplicationCommandOption } from "./types";

interface command {
	name: string,
	description: string,
	guilds: Snowflake[],
	options?: ApplicationCommandOption[],
	execute: (interaction: Interaction) => any|void
}

export default class GuildCommand {
	
	public name: string;
	public description: string;
	public guilds: Snowflake[];
	public options?: ApplicationCommandOption[];
	public execute: (interaction: Interaction) => any|void;

	constructor(data: command) {
		this.name = data.name;
		this.description = data.description;
		this.guilds = data.guilds;
		this.options = data.options;
		this.execute = data.execute;
	}
	
	public async id(client: Client, guilds = this.guilds) {
		let data = new Array();
		for (let guild of guilds) { // @ts-expect-error
			const commands = await client.api.applications(client.user.id).guilds(guild).commands.get();
			const command = commands.find((command: any) => command.name === this.name);
			const id = command.id;
			data.push({guild: guild, id: id});
		}
		return data;
	}

	public async post(client: Client, guilds = this.guilds) {
		const data = {
			name: this.name,
			description: this.description,
			options: this.options
		}
		for (let guild of guilds) { // @ts-expect-error
			client.api.applications(client.user.id).guilds(guild).commands.post({data: data})
			.catch(console.error);
		}
			
		return this;
	}

	public async delete(client: Client) {
		const command = await this.id(client);
		for (let commands of command) { // @ts-expect-error
			client.api.applications(client.user.id).guilds(commands.guild).commands(commands.id).delete().catch(console.error)
		}
	
		return this;
	}
};