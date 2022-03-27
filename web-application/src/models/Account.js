const Sequelize = require('sequelize');
const sequelize = require('../data-access-layer/connection-sq');

module.exports = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    currentbarrunda: {
        type: Sequelize.INTEGER,
    },
    teamid: {
        type: Sequelize.INTEGER
    }
},
{
    timestamps: false
})