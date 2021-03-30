// This package is based on the one built by xlyr.on; it has been archived so I am making a fork that's modified specifically for Vagan.

import { Interaction } from "./slash";
import { Client, Snowflake } from "discord.js";
import { ApplicationCommand, ApplicationCommandOption } from "./types";

interface Command extends ApplicationCommand {
	name: string;
	description: string;
	options?: ApplicationCommandOption[];
	execute: (interaction: Interaction) => any|void;
}

export default class GlobalCommand implements Command {

	public name: string;
	public description: string;
	public options?: ApplicationCommandOption[];
	public execute: (interaction: Interaction) => any|void;

	constructor(data: Command) {
		this.name = data.name;
		this.description = data.description;
		this.options = data.options;
		this.execute = data.execute;
	}

	public async id(client: Client) { // @ts-expect-error
		const commands = await client.api.applications(client.user.id).commands.get();
		const command = commands.find((command: any) => command.name === this.name);
		const id: Snowflake = command.id;
		return id;
	}

	public async post(client: Client) {
		const data = {
			name: this.name,
			description: this.description,
			options: this.options
		} // @ts-expect-error
		client.api.applications(client.user.id).commands.post({ data })
			.catch(console.error);
		return this;
	}

	public async delete(client: Client) {
		const command = await this.id(client); // @ts-expect-error
		client.api.applications(client.user.id).commands(command.id).delete()
			.catch(console.error);
		return this;
	}
};