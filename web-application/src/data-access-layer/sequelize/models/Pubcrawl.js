const Sequelize = require('sequelize');
const sequelize = require('../connection-sq');

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
    pub_list: {
        type: Sequelize.JSON,
        allowNull: false
    }
}, 
{
    freezeTableName: true,
    timestamps: false
})