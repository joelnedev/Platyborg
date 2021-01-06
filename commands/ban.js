module.exports = { // eslint-disable-line no-undef
	name: "ban",
	description: "Pretends to ban someone",
	aliases: ["banned", "bane", "baned", "fuckyou"],
	execute(message, args, Discord) { // eslint-disable-line no-unused-vars
		const { banReplies } = require("../info/randomMessages.json"); // eslint-disable-line no-undef
		const embed = new Discord.MessageEmbed()
			.setTitle("Baned!")
			.setColor("#00ff00")
			.setDescription(banReplies[Math.floor(Math.random() * banReplies.length)])
			.setAuthor(message.member.nickname, message.author.avatarURL())
			.setFooter("Nobody was baned in the makeing of this joek");
		message.channel.send(embed);
	},
};