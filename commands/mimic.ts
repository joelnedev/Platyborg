import { GlobalCommand, Interaction } from "../util/exports.js";
import { User, Webhook, WebhookClient } from "discord.js";
export default new GlobalCommand({
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
	],
	async execute(interaction: Interaction) {
		const content: string = interaction.args.find(arg => arg.name === "content").value;
		const user: User = await interaction.bot.users.fetch(interaction.args.find(arg => arg.name === "user").value);
		const anon: boolean = interaction.args.find(arg => arg.name === "anonymous").value;

		await interaction.respond("Working on it...", { ephemeral: true });

		// @ts-expect-error
		interaction.channel.createWebhook(interaction.bot.KBC.members.cache.get(user.id), {
			avatar: user.displayAvatarURL(),
			reason: `${user.tag} used \`/mimic\``
		}).then(async (Webhook: Webhook) => { // @ts-expect-error
			const webhook = new WebhookClient(Webhook.id, Webhook.token);
			await webhook.send(content);
			webhook.delete();
		});
	},
});