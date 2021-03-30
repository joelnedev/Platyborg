var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Josh from "@joshdb/core";
import provider from "@joshdb/mongo";
export const blackMarket = {
    users: new Josh({
        name: "users",
        provider,
        providerOptions: {
            collection: "vagansvault",
            url: process.env.MONGO_URL
        }
    }),
    items: new Josh({
        name: "items",
        provider,
        providerOptions: {
            collection: "vagansvault",
            url: process.env.MONGO_URL
        }
    }),
    roles: new Josh({
        name: "roles",
        provider,
        providerOptions: {
            collection: "vagansvault",
            url: process.env.MONGO_URL
        }
    }),
    add(id, amount, where = "cash") {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = {
                id: id,
                cash: 0,
                bank: 0,
                items: []
            };
            console.log(id);
            console.log(newUser);
            yield blackMarket.users.ensure(`${id}`, newUser);
            console.log("innocentcitizensofnewjersey")
            yield blackMarket.users.math(`${id}`, `${where}`, "add", amount);
            const User = yield blackMarket.users.get(id);
            console.log(User);
            return User;
        });
    },
    subtract(id, amount, where = "cash") {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = {
                id: id,
                cash: 0,
                bank: 0,
                items: []
            };
            yield blackMarket.users.ensure(id, newUser);
            yield blackMarket.users.math(`${id}.${where}`, "subtract", amount);
            const User = yield blackMarket.users.get(id);
            return User;
        });
    },
    deposit(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield blackMarket.users.get(id);
            if (amount > user.cash)
                return "Not enough money in cash";
            yield blackMarket.users.math(`${id}.cash`, "subtract", amount);
            yield blackMarket.users.math(`${id}.bank`, "add", amount);
            const User = yield blackMarket.users.get(id);
            return User;
        });
    },
    withdraw(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield blackMarket.users.get(id);
            if (amount > user.bank)
                return "Not enough money in bank";
            yield blackMarket.users.math(`${id}.bank`, "subtract", amount);
            yield blackMarket.users.math(`${id}.cash`, "add", amount);
            const User = yield blackMarket.users.get(id);
            return User;
        });
    },
    addItem(id, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blackMarket.users.push(`${id}.items`, itemID, true);
            return blackMarket.users.get(`${id}`);
        });
    }
};
