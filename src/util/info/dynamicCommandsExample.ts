// @ts-nocheck
// This file is to explain how the dynamic command modules work as well as to provide skeleton code for me and contributers to copy/paste into new command files (not everything in programming is just rapid typing)

// This line gets classes from da-slash and calls them via their names.
import { GlobalCommand, Interaction } from "../util/exports.js";
// This line notes that the file is a commonjs module to be imported in another file (Vagan.js)
export default new GlobalCommand({
	name: "name of slash command",
	description: "description of slash command",
	options: [{
		"name": "name of option",
		"description": "description of option",
		"type": 3, // ApplicationCommandOptionType 3 is string
		"choices": [{
			"name": "name of choice 1",
			"value": "value of choice 1"
		},
		{
			"name": "name of choice 2",
			"value": "value of choice 2"
		}]
	}], /* Options the user is given. These can be really, really confusing so go check out https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption and
		   https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups as it explains it better than I can. */
	execute(interaction: Interaction) {
		// Code to be executed when the command is run goes here.
	},
});

// The following code block is to be copied into a new command file.

import { GlobalCommand, Interaction } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
	name: "",
	description: "",
	execute(interaction: Interaction) {

	},
});