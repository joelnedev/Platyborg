module.exports = { // eslint-disable-line no-undef
	name: "kill",
	description: "Kills Vagan 😁",
	args: false,
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord) {
		// eslint-disable-next-line no-undef
		const godModeUsers = require("../info/config.json");
		// If a "God Mode" user executes "kill", kill the process. Otherwise, politely inform them that they lack the permissions to do so.
		if (godModeUsers.some((ID) => message.author.id === ID)) {
			message.channel.send("rebooting :grin::+1:").then(() => { process.exit(); }); // eslint-disable-line no-undef
		} else {
			message.channel.send("no");
		}
	},
};