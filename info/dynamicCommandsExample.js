// This file is to explain how the dynamic command modules work as well as to provide skeleton code for me and contributers to copy/paste into new command files (not everything in programming is just rapid typing)
// This line notes that it's a commonjs module to be imported in another file (Vagan.js).
module.exports = { // eslint-disable-line no-undef
	name: "The name of the command",
	description: "A description of the command",
	aliases: ["other", "ways", "to", "call", "a", "command"],
	args: false, // If the command requires arguments or not
	usage: " ", // How to use the command
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, currency, CurrencyShop, Users, Op, prefix, godModeUsers, errorReplies) {
		// This is where the magic happens. Code to be executed when this command is run goes here.
	},
};

module.exports = { // eslint-disable-line no-undef
	name: "",
	description: "",
	aliases: [],
	args: false, 
	usage: " ", 
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, currency, CurrencyShop, Users, Op, prefix, godModeUsers, errorReplies) {
		
	},
};

module.exports = { // eslint-disable-line no-undef
	name: "",
	description: "",
	aliases: [],
	args: false, 
	usage: " ", 
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, currency, CurrencyShop, Users, Op, prefix, godModeUsers, errorReplies) {
		
	},
};