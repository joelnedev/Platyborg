import { GlobalCommand, Interaction } from "../util/exports.js";
export default new GlobalCommand({
	name: "say",
	description: "Say what you say to say",
	options: [
		{
			name: "content",
			description: "What the bot should say",
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
		const content: string = interaction.args.find(arg => arg.value === "content").value;
		const anonSay: () => void = async () => {
			await interaction.respond("ok", { ephemeral: true });
			await interaction.channel.send(content); // @ts-expect-error
			interaction.bot.channels.cache.get("688757903905259580").send(`${interaction.author?.tag} said: \n \`${content}\``);
		}

		interaction.args.find(arg => arg.name === "anonymous").value === false ? await interaction.respond(content, { stripMentions: true }) : anonSay();
	},
});