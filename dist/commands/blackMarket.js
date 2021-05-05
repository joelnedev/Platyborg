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
    execute(interaction) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __awaiter(this, void 0, void 0, function* () {
            const Vagan = interaction.bot;
            const command = {
                tools: {
                    replaceReplies: (replies, amount) => {
                        const Replies = [];
                        replies.forEach((reply) => {
                            const emoji = (id) => { return Vagan.emojis.cache.get(id); };
                            const emojis = [];
                            ["817125266593808435", "817125375699845171", "817125438110826547", "817125529555697735"].forEach(emojiID => emojis.push(emoji(emojiID)));
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
            const subcommand = (_a = interaction.args[0].options) === null || _a === void 0 ? void 0 : _a[0];
            command.name = subcommand === null || subcommand === void 0 ? void 0 : subcommand.name;
            switch (subcommand === null || subcommand === void 0 ? void 0 : subcommand.name) {
                case "rob":
                    command.args.target = yield Vagan.users.fetch((_b = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _b === void 0 ? void 0 : _b[0].value);
                    break;
                case "give":
                    command.args.target = yield Vagan.users.fetch((_c = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _c === void 0 ? void 0 : _c[0].value);
                    command.args.amount = (_d = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _d === void 0 ? void 0 : _d[0].value;
                    break;
                case "balance":
                    command.args.target = (((_e = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _e === void 0 ? void 0 : _e[0].value) ? yield Vagan.users.fetch((_f = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _f === void 0 ? void 0 : _f[0].value) : interaction.author?);
                    break;
                case "item":
                    command.args.target = (_g = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _g === void 0 ? void 0 : _g[0].value;
                    break;
                case "blackjack":
                    command.args.bet = (_j = (_h = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _h === void 0 ? void 0 : _h.find((arg) => arg.name === "bet")) === null || _j === void 0 ? void 0 : _j.value;
                    break;
                case "chickenfight":
                    command.args.bet = (_k = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _k === void 0 ? void 0 : _k[0].value;
                    break;
                case "shop":
                    command.args.page = (_l = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _l === void 0 ? void 0 : _l[0].value;
                    break;
                case "buy":
                    command.args.item = (_m = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _m === void 0 ? void 0 : _m[0].value;
                    break;
                case "sell":
                    command.args.item = (_p = (_o = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _o === void 0 ? void 0 : _o.find((arg) => arg.name === "item")) === null || _p === void 0 ? void 0 : _p.value;
                    if ((_r = (_q = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _q === void 0 ? void 0 : _q.find((arg) => arg.name === "user")) === null || _r === void 0 ? void 0 : _r.value) {
                        command.args.target = yield Vagan.users.fetch((_s = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _s === void 0 ? void 0 : _s[0].value);
                    }
                    break;
                case "trade":
                    command.args.item = (_u = (_t = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _t === void 0 ? void 0 : _t.find((arg) => arg.name === "item")) === null || _u === void 0 ? void 0 : _u.value;
                    command.args.target = yield Vagan.users.fetch((_v = subcommand === null || subcommand === void 0 ? void 0 : subcommand.options) === null || _v === void 0 ? void 0 : _v[0].value);
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
