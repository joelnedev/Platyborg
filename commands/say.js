module.exports = { // eslint-disable-line no-undef
	name: 'Say',
	description: 'Say what you say to say, then delete what you said and say why.',
	// eslint-disable-next-line no-unused-vars
	async run(message, args, Discord) {
		message.channel.send(args.slice(0).join(" "));
		message.delete(`${prefix}say command`);
	},
};