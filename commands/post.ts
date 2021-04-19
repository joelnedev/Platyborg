import { GlobalCommand, Interaction } from "../util/exports.js";
import { MessageEmbed } from "discord.js";
export default new GlobalCommand({
	name: "post",
	description: "Show off your epic talent in #showcase", 
	options: [{
			name: "attachment",
			description: "Indicates whether you're going to send an attachment or not",
			type: 5,
			required: true
		},
		{
			name: "caption",
			description: "A caption to send along with your post",
			type: 3,
			required: false
		}
		
	],
	async execute(interaction: Interaction) {

		// If a user has used showcase recently, dm them with an explanation about the cooldown.
		if (interaction.bot.showcaseCooldown.has(interaction.author?.id)) {
			interaction.author?.send("You can post one showcase every 5 minutes. To discuss a showcase, use the appropriate channel (or sopones wil bane you)");
			return;
		}
		
		// Creates a message embed and assigns properties on declaration.
		const caption = interaction.args.find(arg => arg.name === "caption").value;
		const embed = new MessageEmbed()
			.setAuthor(interaction.member?.displayName, interaction.author?.displayAvatarURL())
			.setColor(interaction.member?.displayHexColor)
			.setTitle(`Showcase by ${interaction.author?}`)
			.setFooter("If you want to post your own showcase, go to any channel and type `/post` ")
			.setTimestamp()
			.setDescription(caption ? caption : "The author didn't add a caption");
		
		// Assign properties if they exist
		if (interaction.args.find(arg => arg.name === "attachment")) {
			await interaction.author?.send("Send your attachment here.").catch(() => { return interaction.respond("You'll need to allow DMs from me to include an attachment.", { ephemeral: true }) })
			interaction.author?.dmChannel?.awaitMessages(m => m.author.id === interaction.author?.id)
				.then(collected => { // @ts-expect-error
					embed.setImage(collected.last().attachments.last().proxyURL);
				});
		} else {
			embed.addField("No attachment", "The author didn't attach anything");
		}

		// Send the embed in #showcase
		interaction.respond("Posted!", { ephemeral: true }); // @ts-expect-error
		interaction.bot.channels.cache.get("702481578529652796").send(embed);

		// Cooldown (but not for god mode users cause they may be testing the command)
		if (!interaction.bot.hideout.godModeUsers.includes(interaction.author?.id)) {
			interaction.bot.showcaseCooldown.add(interaction.author?.id);
			setTimeout(() => {
				interaction.bot.showcaseCooldown.delete(interaction.author?.id);
			}, 300000);
		}
	},
});