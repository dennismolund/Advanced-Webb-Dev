const { Sequelize } = require('sequelize');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');

module.exports = ({}) => { 

    //TODO: HANDLE ERRORS
    return{ 
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
                if (e.original?.code === "ER_DUP_ENTRY") callback(["Username is already taken"], null);
                else callback(['Internal server error'], null);
            }
        },
        loginRequest: async (account, callback) => { 
            try {
                const users = await Account.findAll({ where: { username: account.enteredUsername }});
                if (users.length) callback(null, users[0].dataValues);
				else callback(null, null);
            } catch (e) {
                console.log(e);
                callback(['Internal Server Error'], null);
            }

        },
        getAccountIdByUsername: async (username, callback) => {
            try {
                const users = await Account.findAll({ where: { username: username }});
                if (users.length) callback(null, users[0].dataValues.id);
                else callback(null, null);
            } catch (e) {
                console.log(e);
                callback(['Internal Server Error'], null);
            }
        }
    }
}