import { Vagan } from "../util/exports.js";
import { CommandInteraction, GuildMember, MessageEmbed, Snowflake } from "discord.js";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member!, Vagan.KBC);

	// @ts-expect-error | Set variables
	const value: string|Snowflake = interaction.options[0].options?.[0]?.value; // @ts-expect-error
	const resolved = interaction.toJSON().data?.resolved?.users[value];
	const name = resolved ? `${resolved.username}#${resolved.discriminator}` : undefined;

	// Initialize embed
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, member.user.displayAvatarURL())
		.setColor("#03b1fc")
		.setTitle(`Info for ${name ? name : value}`);

	// Set description
	switch (value) {
		case "720122607541682199": // Stonwam
			const stoneworm = ["stoneworm", "sotenwored", "stonwrom", "stenwor", "wored", "the wored", "stoenwarudo", "sonic admin", "stonorm", "stokenchurch", "stoneromewarm", "stoenwam", "stonenwom", "tenrswom", "stonetoss", "tonestoss", "boneworm", "stonwam"];
			embed.setDescription(`${stoneworm[Math.floor(Math.random() * stoneworm.length)]} bad lol`);
			break;
		case "525333951225528320": // Spon
			embed.setDescription("He is an extremely amazing and totally awesome admin (please help if i show any disrespect i will be killed :sob:)");
			break;
		case "268138992606773248": // JoJo Bot
			embed.setDescription("The best mod in the server, and also my dad (he created me).");
			break;
		case "766295959700897813": // vegen
			embed.setDescription("I'm Vagan, a character from Killer Bean Forever. (Technically I'm dead but that's not the point.) \n You can see what I can do by typing `/` and browsing through what's listed under my section. (By the way, you can get technical info with `/botinfo`.) ");
			break;
		case "615720739328491526": // talked 40
			embed.setDescription("She is a Shadow Bean and amazing artist (in fact, she drew my profile picture!)");
			break;
		case "Killer Bean Club": // Server
			embed.setDescription("Killer Bean Club is a Killer Bean-based server with a close and ever-growing community.");
			break;
		case "Shadow Bean": // Shadow Bean
			embed.setDescription(`To become a Shadow Bean you must:
• Be at least level 10 on RoboTop XP system
• Be trusted by all admins
• Have at least 3 existing shadow beans nominate you for it`);
			break;
		case "Content Creator": // Content creator
			embed.setDescription("To get the Content Creator role, you must send spoons a link to your YouTube or Twitch channel with over 1000 subscribers.");
			break;
		default:
			embed.setDescription("Who's that? Ask me about someone I know.");
	}
	interaction.reply({ embeds: [embed], ephemeral: interaction.options.find(arg => arg.name === "public")?.value as boolean });
}
command.help = {
	name: "info",
	description: "Provides extremely helpful information on users and other things (for more details, use RoboTop)", 
	options: [
		{
			name: "user",
			description: "User to get information on",
			type: 1,
			options: [
				{
					name: "user",
					description: "User to get information on",
					type: 6,
					required: true
				},
				{
					name: "public",
					description: "Whether or not to show the message to everyone",
					type: 5,
					required: true
				}
			]
		},
		{
			name: "other",
			description: "Other information",
			type: 1,
			options: [
				{
					name: "info",
					description: "What to get info on",
					type: 3,
					required: true,
					choices: [
						{
							name: "server",
							value: "Killer Bean Club"
						},
						{
							name: "shadowbean",
							value: "Shadow Bean"
						},
						{
							name: "content creator",
							value: "Content Creator"
						}
					]
				},
				{
					name: "public",
					description: "Other options to get information on",
					type: 5,
					required: true
				}
			]
		}
	]
}
