const Sequelize = require('./connection-sq');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Pubcrawl');
const ERROR_ENUM = require('../models/error.enum');

module.exports = ({}) => { 

    return {
        storeBarRunda: async (barRunda, userId, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newBarrunda = await Barrunda.create({
                    owner_id: userId,
                    data: JSON.stringify(barRunda)
                });
                const update = await Account.update(
                    { pubcrawl_id: newBarrunda.dataValues.id },
                    { where: { id: userId } }
                );
                await transaction.commit();
                
                const result = newBarrunda.dataValues;
                result.insertId = result.id;

                callback(null, result);
            } catch (e) {
                await transaction.rollback();
                console.log('Error creating pub crawl: ', e);
                callback(new Error(ERROR_ENUM.SERVER_ERROR), null);
            }
        },
        getBarRunda: async (account, callback) => {
            console.log('Get pub crawl: account ', account);
            const transaction = await Sequelize.transaction();
            try {
                console.log(account.username);
                const [accountRes] = await Account.findAll(
                    { where: { username: account.username } }
                );
                if (!accountRes) {
                    callback(null, null);
                    return;
                } 

                const [barRes] = await Barrunda.findAll({ where: { id: accountRes.dataValues.pubcrawl_id } });
                if (!barRes) callback(null, null);

                await transaction.commit();
                callback(null, barRes.dataValues);
            } catch (e) {
                await transaction.rollback();
                console.log('Error getting pub crawl for account: ', e);
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
                    { pubcrawl_id: null },
                    { where: { pubcrawl_id: id } }
                );
                const teamUpdate = await Team.update(
                    { pubcrawl_id: null },
                    { where: { pubcrawl_id: id } }
                );
                await transaction.commit();
                callback(null, null);

            } catch (e) {
                console.log('Error deleting pub crawl: ', e);
                await transaction.rollback();
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        }
    }
}
