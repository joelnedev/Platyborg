/* eslint-disable no-case-declarations */
module.exports = { // eslint-disable-line no-undef
	name: "info",
	description: "Provides helpful information about the server, a channel, or a staff/active member. For more technical details, use RoboTop.",
	aliases: [],
	args: true,
	usage: " <\"server\" | channel | staff/active member>",
	// eslint-disable-next-line no-unused-vars
	execute(message, args, Discord, prefix) {
		switch(args[0]){
		case "stoneworm":
			const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin", "stonorm", "stokenchurch"];
			message.channel.send(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
			break;
		case "spoons":
			message.channel.send("he is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
			break;
		case "JuhJuhButt":
		case "juhjuhbutt":
		case "JuhJuh":
		case "juhjuh":
		case "Juh":
		case "juh":
			message.channel.send("The best mod in the server, and also my dad (he created me)");
			break;
		case "Vagan":
		case "vagan":
		case "bot":
		case "you":
			message.channel.send(`I'm Vagan, a character from Killer Bean Forever. (Technically I'm dead but that's not the point.) You can see what I can do by sending ${prefix}help.`);
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
			message.channel.send(`To become a shadow bean you must:
	- be at least level 10 on RoboTop xp system
	- be trusted by all admins
	- have at least 3 existing shadow beans nominate you for it`);
			break;
		case "server":
		//	message.channel.send("Killer Bean Club is a cool pl")
			break;
		}
	},
};