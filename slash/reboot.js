module.exports = { // eslint-disable-line no-undef
	name: "reboot",
	description: "Reboots Vagan if you have the permissions",
	args: false,
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		// If a "God Mode" user executes "kill", kill the process. Otherwise, politely inform them that they lack the permissions to do so.
		if (bot.guilds.cache.get("794303785572237322").members.cache.get(interaction.author.id).roles.cache.has("797151488493223986")) {
			interaction.channel.send("rebooting :grin::+1:").then(() => { process.exit(); }); // eslint-disable-line no-undef
		}
	},
};