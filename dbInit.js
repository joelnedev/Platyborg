// This file initializes sequelize and ensures that the right items are in the shop with the right price.

/* eslint-disable quotes */
// eslint-disable-next-line no-undef
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// eslint-disable-next-line no-undef
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
// eslint-disable-next-line no-undef
require('./models/Users')(sequelize, Sequelize.DataTypes);
// eslint-disable-next-line no-undef
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

// eslint-disable-next-line no-undef
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'XP Boost', cost: 50000 }),
		CurrencyShop.upsert({ name: 'DJ Decks', cost: 1000000 }),
	];
	await Promise.all(shop);
	// eslint-disable-next-line no-undef
	console.log('Database synced');
	sequelize.close();
// eslint-disable-next-line no-undef
}).catch(console.error);