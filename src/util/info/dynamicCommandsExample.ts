// @ts-nocheck
// This file is to explain how the dynamic command modules work as well as to provide skeleton code for me and contributers to copy/paste into new command files (not everything in programming is just rapid typing)

import { Vagan } from "../util/exports.js";
import { CommandInteraction, GuildMember } from "discord.js";
// This is what will be executed when a command is invoked
export const execute = (interaction: CommandInteraction) => {
	// This ensures that I have a d.js GuildMember to work with
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);

	// stuff goes here
}
export const help = {
	name: "name of slash command",
	description: "description of slash command",
	options: [
		{
			"name": "name of option",
			"description": "description of option",
			"type": 3, // ApplicationCommandOptionType 3 is string
			"choices": [
				{
					"name": "name of choice 1",
					"value": "value of choice 1"
				},
				{
					"name": "name of choice 2",
					"value": "value of choice 2"
				}
			]
		}
	], /* Options the user is given. These can be really, really confusing so go check out https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption and
		   https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups as it explains it better than I can. */
}
// This line notes that the file is an ES module to be imported and executed in another file (Vagan.ts)


// The following code block is to be copied into a new command file.

import { Vagan } from "../util/exports.js";
import { MessageEmbed, CommandInteraction, GuildMember } from "discord.js";
export const execute = (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);

}
export const help = {
	name: "name of slash command",
	description: "description of slash command",
	options: [
		{
			"name": "name of option",
			"description": "description of option",
			"type": 3, 
			"choices": [
				{
					"name": "name of choice 1",
					"value": "value of choice 1"
				},
				{
					"name": "name of choice 2",
					"value": "value of choice 2"
				}
			]
		}
	]
}

