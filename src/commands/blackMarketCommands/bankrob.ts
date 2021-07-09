import { CommandInteraction } from "discord.js";
const command: any = {};
command.execute = async (interaction: CommandInteraction, commandParam: any) => { return interaction.reply({ content: "This command is in progress and not available. Stay tuned, it'll go live soon!", ephemeral: true }); }
export default command;