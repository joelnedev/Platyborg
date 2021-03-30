var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalCommand } from "../util/exports.js";
export default new GlobalCommand({
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
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const Vagan = interaction.bot;
            const command = {
                tools: {
                    replaceReplies: (replies, amount) => {
                        const Replies = [];
                        replies.forEach((reply) => {
                            const emoji = (id) => { return Vagan.emojis.cache.get(id); };
                            const emojis = [emoji("817125266593808435"), emoji("817125375699845171"), emoji("817125438110826547"), emoji("817125529555697735")];
                            Replies.push(reply.replace("{amount}", `${emojis[Math.floor(Math.random() * emojis.length)]}${amount}`));
                        });
                        return Replies;
                    },
                    randomNumber: (min, max) => {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                },
                args: {}
            };
            const subcommand = interaction.args[0].options[0];
            switch (subcommand.name) {
                case "rob":
                    command.name = "rob";
                    command.args.target = yield Vagan.users.fetch(subcommand.options[0].value.id);
                    break;
                case "give":
                    command.name = "give";
                    command.args.target = yield Vagan.users.fetch(subcommand.options[0].value.id);
                    command.args.amount = subcommand.options[0].value;
                    break;
                case "balance":
                    command.name = "balance";
                    command.args.target = (subcommand.options[0].value ? yield Vagan.users.fetch(subcommand.options[0].value.id) : interaction.author);
                    break;
                case "item":
                    command.name = "iteminfo";
                    command.args.target = subcommand.options[0].value;
                    break;
                case "blackjack":
                    command.name = "blackjack";
                    command.args.bet = subcommand.options.find((arg) => arg.name === "bet").value;
                    break;
                case "chickenfight":
                    command.name = "chickenfight";
                    command.args.bet = subcommand.options[0].value;
                    break;
                case "buy":
                    command.name = "buy";
                    command.args.item = subcommand.options[0].value;
                    break;
                case "sell":
                    command.name = "sell";
                    command.args.item = subcommand.options.find((arg) => arg.name === "item").value;
                    if (subcommand.options.find((arg) => arg.name === "user").value) {
                        const user = Vagan.users.fetch(subcommand.options[0].value.id);
                        command.args.target = yield user;
                    }
                    break;
                case "trade":
                    command.name = "trade";
                    command.args.item = subcommand.options.find((arg) => arg.name === "item").value;
                    command.args.target = yield Vagan.users.fetch(subcommand.options[0].value.id);
                    break;
                default:
                    command.name = subcommand.name;
                    break;
            }
            try {
                yield require(`./blackMarketCommands/${command.name}.js`).execute(interaction, command);
            }
            catch (error) {
                Vagan.handleError(error, interaction);
            }
        });
    },
});
