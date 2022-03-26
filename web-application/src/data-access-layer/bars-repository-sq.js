const Sequelize = require('./connection-sq');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');
const ERROR_ENUM = require('../models/error.enum');

module.exports = ({}) => { 

    return {
        storeBarRunda: async (barRunda, userId, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newBarrunda = await Barrunda.create({
                    owner: userId,
                    data: JSON.stringify(barRunda)
                });
                const update = await Account.update(
                    { currentbarrunda: newBarrunda.dataValues.id },
                    { where: { id: userId } }
                );
                await transaction.commit();
                
                const result = newBarrunda.dataValues;
                result.insertId = result.id;

                callback(null, result);
            } catch (e) {
                await transaction.rollback();
                console.log('Error creating barrunda: ', e);
                callback(new Error(ERROR_ENUM.SERVER_ERROR), null);
            }
        },
        getBarRunda: async (account, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const [accountRes] = await Account.findAll(
                    { where: { username: account.username } }
                );
                if (!accountRes) {
                    callback(null, null);
                    return;
                } 

                const [barRes] = await Barrunda.findAll({ where: { id: accountRes.dataValues.currentbarrunda } });
                if (!barRes) callback(null, null);

                await transaction.commit();
                callback(null, barRes.dataValues);
            } catch (e) {
                await transaction.rollback();
                console.log('Error getting barrunda for account: ', e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        getBarrundaById: async (id, callback) => {
            try {
                const [barsRes] = await Barrunda.findAll({ where: { id } });
                callback(null, barsRes.dataValues);
            } catch (e) {
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },

        deleteBarrundaById: async (id, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const deleteRes = await Barrunda.destroy({ where: { id } });
                const accountUpdate = await Account.update(
                    { currentbarrunda: null },
                    { where: { currentbarrunda: id } }
                );
                const teamUpdate = await Team.update(
                    { currentbarrunda: null },
                    { where: { currentbarrunda: id } }
                );
                await transaction.commit();
                callback(null, null);

            } catch (e) {
                console.log('Error deleting barrunda: ', e);
                await transaction.rollback();
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        }
    }
}
