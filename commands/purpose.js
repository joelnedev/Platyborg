module.exports = { // eslint-disable-line no-undef
	name: "purpose",
	description: "Explains the relevance of its purpose.",
	execute(message, args, Discord) { // eslint-disable-line no-unused-vars
		const { purposeReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		message.channel.send(purposeReplies[Math.floor(Math.random() * purposeReplies.length)])
			.then(message.channel.send("*This command is deprecated. It will be removed in about a week in favor of slash commands.*"));
	},
};