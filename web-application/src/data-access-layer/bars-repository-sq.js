const Sequelize = require('./connection-sq');
const Account = require('./models/Account')
const Pubcrawl = require('./models/Pubcrawl');
const ERROR_ENUM = require('../business-logic-layer/models/error_enum');

module.exports = ({}) => { 
    return {
        storePubcrawl: async (pubcrawl, userId, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newPubcrawl = await Pubcrawl.create({
                    owner_id: userId,
                    data: JSON.stringify(pubcrawl)
                });
                const update = await Account.update(
                    { pubcrawl_id: newPubcrawl.dataValues.id },
                    { where: { id: userId } }
                );
                await transaction.commit();
                
                const result = newPubcrawl.dataValues;
                result.insertId = result.id;

                callback(null, result);
            } catch (e) {
                await transaction.rollback();
                console.log('Error creating pub crawl: ', e);
                callback(new Error(ERROR_ENUM.SERVER_ERROR), null);
            }
        },
        updatePubcrawlById: async (id, pubcrawl, callback) => {
            const data = JSON.stringify(pubcrawl);
            try {
                const result = await Pubcrawl.update({
                    data,
                }, {
                    where: {
                        id
                    }
                });
                console.log('Successfull update');
                callback(null, result);
            } catch (e) {
                console.log(e);
                callback(e, null);
            }
        },
        getPubcrawl: async (account, callback) => {
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

                const barRes = await Pubcrawl.findOne({ 
                    where: { 
                        id: accountRes.dataValues.pubcrawl_id
                    } 
                });
                if (!barRes) callback(null, null);
                await transaction.commit();
                callback(null, barRes.dataValues);
            } catch (e) {
                await transaction.rollback();
                console.log('Error getting pub crawl for account: ', e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        getPubcrawlById: async (id, callback) => {
            try {
                const barsRes = await Pubcrawl.findOne({ 
                    where: { 
                        id
                    } 
                });
                callback(null, barsRes.dataValues);
            } catch (e) {
                console.log('Bars res got error: ', e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }   
        },
        deletePubcrawlById: async (id, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const deleteRes = await Pubcrawl.destroy({ 
                    where: { 
                        id
                    } 
                });
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
