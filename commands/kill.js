module.exports = { // eslint-disable-line no-undef
	name: 'Kill',
	description: 'Kills Chintow :troll4k:',
	args: false,
	execute(message, args, Discord) {
        // If a "God Mode" user (Spoons, Stoneworm, JuhJuhButt) executes "kill", kill the process. Otherwise, politely explain that they lack the permissions to do so. 
		const {godModeUsers} = require("../info/config.json");
		if (godModeUsers.some(ID => message.author.id === ID)) {
			message.channel.send("rebooting :grin::+1:").then(() => { process.exit() }); // eslint-disable-line no-undef
		} else {
			message.channel.send("no");
		}
	},
};