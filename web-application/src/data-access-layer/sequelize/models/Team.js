const Sequelize = require('sequelize');
const sequelize = require('../connection-sq');

module.exports = sequelize.define("team", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pubcrawl_id: {
        type: Sequelize.INTEGER
    }
},
{
    timestamps: false,
    freezeTableName: true,
    tableName: 'team'
})
