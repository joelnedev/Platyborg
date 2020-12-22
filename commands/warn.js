module.exports = { // eslint-disable-line no-undef
	name: 'Warn',
	description: 'Warns someone',
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord) {
		message.channel.send("ok");
		message.author.send("bro you got warned :troll4k:");
	},
};