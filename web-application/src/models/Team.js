const Sequelize = require('sequelize');
const sequelize = require('../data-access-layer/connection-sq');

module.exports = sequelize.define("team", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    teamname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    creatorid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    currentbarrunda: {
        type: Sequelize.INTEGER
    }
},
{
    timestamps: false
})
