/* eslint-disable no-case-declarations */
module.exports = { // eslint-disable-line no-undef
	name: "info",
	description: "Provides helpful information about the server, a channel, or a staff/active member. For more technical details, use RoboTop.",
	aliases: ["i"],
	args: true,
	usage: " <\"server\" | channel | staff/active member>",
	responseType: 5,
	// eslint-disable-next-line no-unused-vars
	execute(interaction, args, Discord, nickname, client, bot, /* currency, CurrencyShop, Users, Op, */ config, godModeUsers, errorReplies) {
		switch(args[0]){
		case "stoneworm":
			const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin", "stonorm", "stokenchurch", "stoneromewarm", "stoenwam", "stonenwom", "tenrswom", "stonetoss", "tonestoss"];
			interaction.channel.send(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
			break;
		case "spoons":
			interaction.channel.send("He is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
			break;
		case "JuhJuhButt":
		case "juhjuhbutt":
		case "JuhJuh":
		case "juhjuh":
		case "Juh":
		case "juh":
			interaction.channel.send("The best mod in the server, and also my dad (he created me).");
			break;
		case "Vagan":
		case "vagan":
		case "bot":
		case "you":
			interaction.channel.send(`I'm Vagan, a character from Killer Bean Forever. (Technically I'm dead but that's not the point.) \n You can see what I can do by sending \`${config.bot.prefix}help\` or by typing \`/\` and browsing through what's listed under "Vagan" (note that some commands may not be supported by native slash commands).`);
			break;
		case "Shadow":
		case "shadow":
		case "Shadowbeans":
		case "Shadowbean":
		case "ShadowBeans":
		case "ShadowBean":
		case "shadowbeans":
		case "shadowbean":
		case "shadowBeans":
		case "shadowBean":
		case "sb":
			interaction.channel.send(`To become a shadow bean you must:
	- be at least level 10 on RoboTop xp system
	- be trusted by all admins
	- have at least 3 existing shadow beans nominate you for it`);
			break;
		case "server":
		case "KBC":
		case "kbc":
		case "Killer":
		case "killer":
			interaction.channel.send("Killer Bean Club is a Killer Bean-oriented server with a close and ever-growing community.");
			break;
		}
	},
};