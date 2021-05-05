var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readdirSync } from 'fs';
export default class Client {
    constructor(Vagan) {
        this.Vagan = Vagan;
    }
    get commands() {
        const folder = readdirSync("../../commands");
        const commands = new Map();
        for (const file of folder) {
            const command = require(`../../command/${file}`);
            commands.set(command.name, command);
        }
        return commands;
    }
    ;
    findCommand(commandName) {
        const folder = readdirSync("../../commands");
        for (const file of folder) {
            const command = require(`../../commands/${file}`);
            return command.name == commandName ? command : undefined;
        }
    }
    matchCommand(interaction) {
        var _a;
        const command = this.findCommand((_a = interaction.request.data) === null || _a === void 0 ? void 0 : _a.name);
        command === null || command === void 0 ? void 0 : command.execute(interaction);
        return command;
    }
    postCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const Vagan = this.Vagan;
            const commands = this.commands;
            for (const command of commands) {
                yield command[1].post(Vagan);
            }
            const globalCommands = yield Vagan.api.applications(Vagan.user.id).commands.get();
            for (const command of globalCommands) {
                const match = this.findCommand(command.name);
                !match ? yield Vagan.api.applications(Vagan.user.id).commands(command.id).delete()
                    .catch(console.error) : '';
            }
            for (const guild of Vagan.guilds.cache.array()) {
                const guildCommands = yield Vagan.api.applications(Vagan.user.id).guilds(guild.id).commands.get()
                    .catch(console.error);
                if (guildCommands) {
                    for (const command of guildCommands) {
                        const match = this.findCommand(command.name);
                        !match ? yield Vagan.api.applications(Vagan.user.id).guilds(guild.id).commands(command.id).delete()
                            .catch(console.error) : '';
                    }
                }
            }
            return commands;
        });
    }
}
;
