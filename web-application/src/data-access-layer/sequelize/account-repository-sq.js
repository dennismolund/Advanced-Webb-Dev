const Account = require('./models/Account');
const ERROR_ENUM = require('../error_enum');

module.exports = ({}) => { 
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
                if (e.original?.code === "ER_DUP_ENTRY") {
                    if (e.original?.sqlMessage.includes('email')) {
                        callback(ERROR_ENUM.EMAIL_TAKEN, null);
                    }
                    else callback(ERROR_ENUM.USERNAME_TAKEN, null);
                }
                else callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        loginRequest: async ({ enteredUsername }, callback) => { 
            try {
                const account = await Account.findOne({ 
                    where: { 
                        username: enteredUsername 
                    }
                });
                if (!!account) callback(null, account.dataValues);
				else callback(null, null);
            } catch (e) {
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }

        },
        getAccountById: async (id, callback) => {
            try {
                const account = await Account.findOne({ where: { id }});
                if (!!account) callback(null, account.dataValues);
                else callback(null, null);
            } catch (e) {
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        }
    }
}