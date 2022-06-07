const { Sequelize } = require('sequelize');
const Team = require('../business-logic-layer/models/Team')
const Account = require('../business-logic-layer/models/Account')
const Barrunda = require('../business-logic-layer/models/Pubcrawl');
const ERROR_ENUM = require('../business-logic-layer/models/error.enum');

module.exports = ({}) => { 

    //TODO: HANDLE ERRORS
    return { 
        createAccount: async (account, callback) => {
            try {
                const newAccount = await Account.create({
                    username: account.username,
                    email: account.email,
                    password: account.password
                });
                callback(null, newAccount.dataValues.id);
            } catch (e) {
                console.log(e);
                if (e.original?.code === "ER_DUP_ENTRY") {
                    if (e.original?.sqlMessage.includes('email')) callback(ERROR_ENUM.EMAIL_TAKEN, null);
                    else callback(ERROR_ENUM.USERNAME_TAKEN, null);
                }
                else callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        loginRequest: async (account, callback) => { 
            try {
                const users = await Account.findAll({ where: { username: account.enteredUsername }});
                if (users.length) callback(null, users[0].dataValues);
				else callback(null, null);
            } catch (e) {
                console.log(e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }

        },
        getAccountById: async (id, callback) => {
            try {
                const users = await Account.findAll({ where: { id }});
                if (users.length) callback(null, users[0].dataValues);
                else callback(null, null);
            } catch (e) {
                console.log(e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        getAccountIdByUsername: async (username, callback) => {
            try {
                const users = await Account.findAll({ where: { username }});
                if (users.length) callback(null, users[0].dataValues.id);
                else callback(null, null);
            } catch (e) {
                console.log(e);
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
    }
}