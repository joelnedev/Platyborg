var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class GuildCommand {
    constructor(data) {
        this.name = data.name;
        this.description = data.description;
        this.guilds = data.guilds;
        this.options = data.options;
        this.execute = data.execute;
    }
    id(client, guilds = this.guilds) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = new Array();
            for (let guild of guilds) {
                const commands = yield client.api.applications(client.user.id).guilds(guild).commands.get();
                const command = commands.find((command) => command.name === this.name);
                const id = command.id;
                data.push({ guild: guild, id: id });
            }
            return data;
        });
    }
    post(client, guilds = this.guilds) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: this.name,
                description: this.description,
                options: this.options
            };
            for (let guild of guilds) {
                client.api.applications(client.user.id).guilds(guild).commands.post({ data: data })
                    .catch(console.error);
            }
            return this;
        });
    }
    delete(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = yield this.id(client);
            for (let commands of command) {
                client.api.applications(client.user.id).guilds(commands.guild).commands(commands.id).delete().catch(console.error);
            }
            return this;
        });
    }
}
;
