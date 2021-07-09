import { Vagan } from "../Vagan";
import { GuildEmoji, Snowflake, User, CommandInteraction } from "discord.js";
export const command: any = {};
command.execute = async (interaction: CommandInteraction) => {
	// Declares some helpful stuff
	type Command = {
		name: string,
		tools: {
			replaceReplies: (replies: string[], amount: number) => string[],
			randomNumber: (min: number, max: number) => number,
		},
		args: {
			target?: User,
			bet?: number,
			amount?: number,
			item?: string,
			page?: number
		}
	}
	const command: Command = {
		tools: {
			replaceReplies: (replies: string[], amount: number) => {
				const Replies: string[] = [];
				replies.forEach( (reply: string) => {
					const emoji = (id: Snowflake): GuildEmoji => { return Vagan.emojis.cache.get(id) as GuildEmoji; }
					const emojis: GuildEmoji[] = [];
					[817125266593808435n, 817125375699845171n, 817125438110826547n, 817125529555697735n].forEach(emojiID => emojis.push(emoji(`${emojiID}`)));
					Replies.push(reply.replace("{amount}", `${emojis[Math.floor(Math.random() * emojis.length)]}${amount}`));
				});
				return Replies;
			},
			randomNumber: (min: number, max: number) => {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		},
		args: {}
	} as Command;

	// Store some info based on the arguments supplied
	const subcommand = interaction.options[0].options[0];
	command.name = subcommand.name;
	switch (subcommand.name) {
		case "rob":
			command.args.target = await Vagan.users.fetch(subcommand.options[0].value);
			break;
		case "give":
			command.args.target = await Vagan.users.fetch(subcommand.options[0].value);
			command.args.amount = subcommand.options[0].value;
			break;
		case "balance":
			command.args.target = (subcommand.options[0].value ? await Vagan.users.fetch(subcommand.options[0].value) : interaction.user);
			break;
		case "item":
			command.args.target = subcommand.options[0].value;
			break;
		case "blackjack":
			command.args.bet = subcommand.options.find((arg: any) => arg.name === "bet").value;
			break;
		case "chickenfight":
			command.args.bet = subcommand.options[0].value;
			break;
		case "shop":
			command.args.page = subcommand.options[0].value;
			break;
		case "buy":
			command.args.item = subcommand.options[0].value;
			break;
		case "sell":
			command.args.item = subcommand.options.find((arg: any) => arg.name === "item").value;
			if (subcommand.options.find((arg: any) => arg.name === "user").value) command.args.target = await Vagan.users.fetch(subcommand.options[0].value);
			break;
		case "trade":
			command.args.item = subcommand.options.find((arg: any) => arg.name === "item").value;
			command.args.target = await Vagan.users.fetch(subcommand.options[0].value);
			break;
	}

	try { await import(`./blackMarketCommands/${command.name}`).then(cmdfile => cmdfile.default(interaction, command)); }
	catch (error) { Vagan.handleError(error, interaction); }

};

command.help = {
	name: "blackmarket",
	description: "One command to interact with the whole economy",
	options: [
		{
			name: "beancoin",
			description: "Money-related commands",
			type: 2,
			options: [
				{
					name: "work",
					description: "Get some easy money without a chance of losing anything.",
					type: 1
				},
				{
					name: "slut",
					description: "Whip it out for some money ;)",
					type: 1
				},
				{
					name: "crime",
					description: "Commit a crime for a higher risk, but higher payout.",
					type: 1
				},
				{
					name: "heist",
					description: "Crime but with gambling. You can use items to increase your payout or chance of winning.",
					type: 1
				},
				{
					name: "rob",
					description: "Attempt to rob another user.",
					type: 1,
					options: [
						{
							name: "user",
							description: "User to rob",
							type: 6,
							required: true
						}
					]
				},
				{
					name: "bankrob",
					description: "Start a bank robbery with up to 2 other people to share the reward/penalty with.",
					type: 1
				},
				{
					name: "give",
					description: "Give beancoins to another user",
					type: 1,
					options: [
						{
							name: "user",
							description: "User to give beancoins to",
							type: 6,
							required: true
						},
						{
							name: "amount",
							description: "Amount of beancoins to give the user",
							type: 4,
							required: true
						}
					]
				}
			]
		},
		{
			name: "info",
			description: "Economy-related info",
			type: 2,
			options: [
				{
					name: "balance",
					description: "Get the beancoin balance of yourself or another user",
					type: 1,
					options: [
						{
							name: "user",
							description: "User to get the balance of (if omitted, your own balance will be returned)",
							type: 6,
							required: false
						}
					]
				},
				{
					name: "inventory",
					description: "Show the items in your inventory",
					type: 1
				},
				{
					name: "shop",
					description: "Show all items available to buy",
					type: 1,
					options: [
						{
							name: "page",
							description: "Page number to jump to (default is page 1)",
							type: 4
						}
					]
				},
				{
					name: "item",
					description: "Show information on an item",
					type: 1,
					options: [
						{
							name: "item",
							description: "Item to get information on",
							type: 3,
							required: true
						}
					]
				}
			]
		},
		{
			name: "casino",
			description: "Casino games",
			type: 2,
			options: [
				{
					name: "blackjack",
					description: "Get as close to 21 as possible without going over.",
					type: 1,
					options: [
						{
							name: "bet",
							description: "Amount of cash to bet on the game",
							type: 4,
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
							type: 4,
							required: true
						}
					]
				}
			]
		},
		{
			name: "items",
			description: "Item-related commands",
			type: 2,
			options: [
				{
					name: "buy",
					description: "Buy or craft an item using beancoins and/or your items",
					type: 1,
					options: [
						{
							name: "item",
							description: "The name of an item on the black market",
							type: 3,
							required: true
						}
					]
				},
				{
					name: "sell",
					description: "Sell an item to another user or to Vagan",
					type: 1,
					options: [
						{
							name: "item",
							description: "The name of an item in your inventory",
							type: 3,
							required: true
						},
						{
							name: "user",
							description: "The user to sell to (leave empty to sell to Vagan)",
							type: 6,
							required: false
						}
					]
				},
				{
					name: "trade",
					description: "Trade an item with another user",
					type: 1,
					options: [
						{
							name: "item",
							description: "The name of an item in your inventory",
							type: 3,
							required: true
						},
						{
							name: "user",
							description: "The user to trade with",
							type: 6,
							required: true
						}
					]
				}
			]
		}
	],
}

