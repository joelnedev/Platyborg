module.exports = { // eslint-disable-line no-undef
	name: "say",
	description: "Say what you say to say, then delete what you said and say why.",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, prefix) {
		message.channel.send(args.slice(0).join(" "))
			.then(message.channel.send("*This command is deprecated. It will be removed in about a week in favor of slash commands (this one in particular because interactions can 'eat' commands).*"));
	},
};