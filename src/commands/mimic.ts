import { platyborg } from "../util/index.js";
import { CommandInteraction, GuildMember, TextChannel, User, Webhook, WebhookClient } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	const member = await platyborg.PFC.members.fetch(interaction.user.id);
	const content: string = interaction.options.getString("content")!;
	const anon: boolean = interaction.options.getBoolean("anonymous")!;

	await interaction.reply({ content: "kk", ephemeral: true });

	(interaction.channel as TextChannel).createWebhook(member.nickname ?? interaction.user.username, {
		avatar: interaction.user.displayAvatarURL(),
		reason: `${interaction.user.tag} used \`/mimic\``
	}).then(async (Webhook: Webhook) => {
		const webhook = new WebhookClient({ id: Webhook.id, token: Webhook.token! });
		await webhook.send(content);
		webhook.delete();
	});
}
export const help = {
	name: "mimic",
	description: "Pretend to be another user (like RoboTop's mimic but better because nicknames)",
	options: [
		{
			name: "user",
			description: "User to mimic",
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: "content",
			description: "What the user should say",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "anonymous",
			description: "Whether to show your input publicly",
			type: ApplicationCommandOptionType.Boolean,
			required: true
		}
	]
}