import { GlobalCommand, Interaction } from "../util/exports.js";
export default new GlobalCommand({ 
	name: "help",
	description: "Provides further information about commands", 
	options: [
		{
			name: "command",
			description: "Command to get help on",
			type: 3,
			required: false
		}
	],
	execute(interaction: Interaction) {
		
	},
});