const Sequelize = require('sequelize');
const sequelize = require('../../data-access-layer/connection-sq');

module.exports = sequelize.define('pubcrawl', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    owner_id: {
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