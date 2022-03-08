const Sequelize = require('sequelize');
const sequelize = require('../data-access-layer/connection-sq');

module.exports = sequelize.define('barrunda', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    owner: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    }
}, 
{
    freezeTableName: true,
    timestamps: false
})