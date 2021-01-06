// This file initializes a database for the shop.

// eslint-disable-next-line no-undef
module.exports = (sequelize, DataTypes) => {
	// eslint-disable-next-line quotes
	return sequelize.define('currency_shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};