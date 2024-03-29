const Sequelize = require('./connection-sq');
const Account = require('./models/Account')
const Pubcrawl = require('./models/Pubcrawl');
const ERROR_ENUM = require('../error_enum');

module.exports = ({}) => { 
    return {
        storePubcrawl: async (pubcrawl, userId, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newPubcrawl = await Pubcrawl.create({
                    owner_id: userId,
                    pub_list: JSON.stringify(pubcrawl)
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
                callback(new Error(ERROR_ENUM.SERVER_ERROR), null);
            }
        },
        updatePubcrawlById: async (id, pubcrawl, callback) => {
            const pub_list = JSON.stringify(pubcrawl);
            try {
                const result = await Pubcrawl.update({
                    pub_list,
                }, {
                    where: {
                        id
                    }
                });
                callback(null, result);
            } catch (e) {
                callback(e, null);
            }
        },
        getPubcrawl: async (account, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const [accountRes] = await Account.findAll(
                    { where: { username: account.username } }
                );
                if (!accountRes) {
                    callback(null, null);
                    return;
                } 

                const pubRes = await Pubcrawl.findOne({ 
                    where: { 
                        id: accountRes.dataValues.pubcrawl_id
                    } 
                });
                if (!pubRes) callback(null, null);
                await transaction.commit();
                callback(null, pubRes.dataValues);
            } catch (e) {
                await transaction.rollback();
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        getPubcrawlById: async (id, callback) => {
            try {
                const pubsRes = await Pubcrawl.findOne({ 
                    where: { 
                        id
                    } 
                });
                callback(null, pubsRes.dataValues);
            } catch (e) {
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
                await transaction.rollback();
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        }
    }
}
