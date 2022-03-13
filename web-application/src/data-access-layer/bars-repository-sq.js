const Sequelize = require('./connection-sq');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');


const errHandler = (err) =>{
    console.error("Error: ", err);
    
}

module.exports = ({}) => { 

    return {
        storeBarRunda: async (barRunda, account, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newBarrunda = await Barrunda.create({
                    owner: account.id,
                    data: JSON.stringify(barRunda)
                });
                const update = await Account.update(
                    { currentbarrunda: newBarrunda.dataValues.id },
                    { where: { id: account.id } }
                );
                await transaction.commit();
                
                const result = newBarrunda.dataValues;
                result.insertId = result.id;

                callback(null, result);
            } catch (e) {
                await transaction.rollback();
                console.log('Error creating barrunda: ', e);
                callback(new Error('Database error'), null);
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
                callback('Database error', null);
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
                callback('Database error', null);
            }
        }
    }
}
