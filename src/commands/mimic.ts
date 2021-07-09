import { Vagan } from "../util/exports.js";
import { CommandInteraction, GuildMember, TextChannel, User, Webhook, WebhookClient } from "discord.js";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	const member = new GuildMember(Vagan, interaction.member, Vagan.KBC);
	const content: string = interaction.options.find(arg => arg.name === "content")?.value as string;
	const anon: boolean = interaction.options.find(arg => arg.name === "anonymous")?.value as boolean;

	await interaction.reply({ content: "kk", ephemeral: true });

	(interaction.channel as TextChannel).createWebhook(member.displayName, {
		avatar: member.user.displayAvatarURL(),
		reason: `${member.user.tag} used \`/mimic\``
	}).then(async (Webhook: Webhook) => {
		const webhook = new WebhookClient(Webhook.id, Webhook.token!);
		await webhook.send(content);
		webhook.delete();
	});
}
command.help = {
	name: "mimic",
	description: "Pretend to be another user (like RoboTop's mimic but better because nicknames)",
	options: [
		{
			name: "user",
			description: "User to mimic",
			type: 6,
			required: true
		},
		{
			name: "content",
			description: "What the user should say",
			type: 3,
			required: true
		},
		{
			name: "anonymous",
			description: "Whether to show your input publicly",
			type: 5,
			required: true
		}
	]
}