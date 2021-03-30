// This package is based on the one built by xlyr.on; it has been archived so I am making a fork that's modified specifically for Vagan.

import { readdirSync } from 'fs';
import { Bot } from "../exports";
import { Interaction, GuildCommand, GlobalCommand } from "./slash";

export default class Client {

	private Vagan: Bot;

	constructor(Vagan: Bot) {
		this.Vagan = Vagan;
	}

	public get commands(): Map<string, GuildCommand|GlobalCommand> {
		const folder = readdirSync("../../commands");
		const commands: Map<string, GuildCommand|GlobalCommand> = new Map();
		for (const file of folder) {
			const command = require(`../../command/${file}`);
			commands.set(command.name, command);
		}
		return commands;
	};

	public findCommand(commandName: string): GuildCommand|GlobalCommand|undefined {
		const folder = readdirSync("../../commands");
		for (const file of folder) {
			const command = require(`../../commands/${file}`);
			return command.name == commandName ? command : undefined;
		}
	}

	public matchCommand(interaction: Interaction) { // @ts-expect-error
		const command = this.findCommand(interaction.request.data?.name);
		command?.execute(interaction);
		return command;
	}

	public async postCommands() {
		const Vagan = this.Vagan;
		const commands = this.commands;
		for (const command of commands) {
			await command[1].post(Vagan);
		}

		// @ts-expect-error
		const globalCommands = await Vagan.api.applications(Vagan.user.id).commands.get();
		for (const command of globalCommands) {
			const match = this.findCommand(command.name); // @ts-expect-error
			!match ? await Vagan.api.applications(Vagan.user.id).commands(command.id).delete()
				.catch(console.error) : '';
		}

		for (const guild of Vagan.guilds.cache.array()) { // @ts-expect-error
			const guildCommands = await Vagan.api.applications(Vagan.user.id).guilds(guild.id).commands.get()
				.catch(console.error);
			if (guildCommands) {
				for (const command of guildCommands) {
					const match = this.findCommand(command.name); // @ts-expect-error
					!match ? await Vagan.api.applications(Vagan.user.id).guilds(guild.id).commands(command.id).delete()
						.catch(console.error) : '';
				}
			}
		}

		return commands;
	}
};
