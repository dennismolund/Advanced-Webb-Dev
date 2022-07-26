const Account = require('./models/Account');
const ERROR_ENUM = require('./models/error_enum');

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
                console.log(e);
                if (e.original?.code === "ER_DUP_ENTRY") {
                    if (e.original?.sqlMessage.includes('email')) {
                        callback(ERROR_ENUM.EMAIL_TAKEN, null);
                    }
                    else callback(ERROR_ENUM.USERNAME_TAKEN, null);
                }
                else callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        },
        getAccountByUsername: async (account, callback) => { 
            try {
                const users = await Account.findAll({ 
                    where: { 
                        username: account.enteredUsername 
                    }
                });
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
        }
    }
}