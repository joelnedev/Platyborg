import { Vagan } from "../util/exports.js";
import { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";
export const execute = async (interaction: CommandInteraction) => {
	try { await (await import(`./commands/blackMarketCommands/${interaction.options.getSubcommand(true)}.js`)).execute(interaction); }
	catch (error) { Vagan.handleError(error, interaction); }
};

export const help = {
	name: "blackmarket",
	description: "One command to interact with the whole economy",
	options: [
		{
			name: "beancoin",
			description: "Money-related commands",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "work",
					description: "Get some easy money without a chance of losing anything.",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "slut",
					description: "Whip it out for some quick cash ;)",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "crime",
					description: "Commit a crime — hey, higher risk, higher reward!",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "heist",
					description: "Crime but with gambling. You can use items to increase your payout or chance of winning.",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "rob",
					description: "Attempt to rob another user (crime but you can steal from others).",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "user",
							description: "User to rob",
							type: ApplicationCommandOptionType.User,
							required: true
						}
					]
				},
				{
					name: "bankrob",
					description: "Start a bank robbery with up to 2 other people to share the reward/penalty with.",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "give",
					description: "Give beancoins to another user",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "user",
							description: "User to give beancoins to",
							type: ApplicationCommandOptionType.User,
							required: true
						},
						{
							name: "amount",
							description: "Amount of beancoins to give the user",
							type: ApplicationCommandOptionType.Number,
							required: true
						}
					]
				}
			]
		},
		{
			name: "info",
			description: "Economy-related info",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "balance",
					description: "Get the beancoin balance of yourself or another user",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "user",
							description: "User to get the balance of, if any",
							type: ApplicationCommandOptionType.User,
						}
					]
				},
				{
					name: "inventory",
					description: "Show the items in your inventory",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "shop",
					description: "Show all items available to buy",
					type: ApplicationCommandOptionType.Subcommand,
				},
				{
					name: "item",
					description: "Show information on an item",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "item",
							description: "Item to get information on",
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				}
			]
		},
		{
			name: "casino",
			description: "Casino games",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "blackjack",
					description: "Get as close to 21 as possible without going over.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "bet",
							description: "Amount of cash to bet on the game",
							type: ApplicationCommandOptionType.Number,
							required: true
						}
					]
				},
				{
					name: "chickenfight",
					description: "Send your chicken to the arena!",
					type: 1,
					options: [
						{
							name: "bet",
							description: "Amount of cash to bet on the game",
							type: ApplicationCommandOptionType.Number,
							required: true
						}
					]
				}
			]
		},
		{
			name: "items",
			description: "Item-related commands",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "buy",
					description: "Buy or craft an item using beancoins and/or your items",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "item",
							description: "The name of an item on the black market",
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				},
				{
					name: "sell",
					description: "Sell an item to another user or to Vagan",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "item",
							description: "The name of an item in your inventory",
							type: ApplicationCommandOptionType.String,
							required: true
						},
						{
							name: "user",
							description: "The user to sell to (leave empty to sell to Vagan)",
							type: ApplicationCommandOptionType.User,
							required: false
						}
					]
				},
				{
					name: "trade",
					description: "Trade an item with another user",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "item",
							description: "The name of an item in your inventory",
							type: ApplicationCommandOptionType.String,
							required: true
						},
						{
							name: "user",
							description: "The user to trade with",
							type: ApplicationCommandOptionType.User,
							required: true
						}
					]
				}
			]
		}
	],
}