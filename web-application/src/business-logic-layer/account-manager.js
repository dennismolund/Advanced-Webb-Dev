const accountValidator = require('./account-validator')
const ERROR_ENUM = require('../models/error.enum');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = ({accountRepository}) => {
    // Name all the dependencies in the curly brackets above.
    
    return {
        getAccountIdByUsername: (username, callback) => {
            accountRepository.getAccountIdByUsername(username, (error, results) => {
                if(error) callback(error, null);
                else callback(null, results);
            });
        },

        createAccount: (account, callback) => {

            // Validate the account.
            const errors = accountValidator.getErrorsNewAccount(account);
            
            if(errors.length){
                callback(errors[0], null);
                return;
            }

            bcrypt.hash(account.password, saltRounds, (err, hash) => {
                account.password = hash;

                accountRepository.createAccount(account, callback);
            });
        },

        loginRequest: (account, callback) => {
            // Validate the login credentials.
            const errors = accountValidator.getErrorsLogin(account);

            if(errors.length){
                callback(errors[0], null);
                return;
            }

            accountRepository.loginRequest(account, (error, results) => {
                if(error) callback(error, null);
                else if (!results) callback (ERROR_ENUM.BAD_CREDENTIALS, null);
                else {
                    bcrypt.compare(account.enteredPassword, results.password, (err, res) => {
                        if(res){
                            //Only sending back username, id and email, excluding password due to security.
                            const activeAccount = {
                                username: results.username,
                                email: results.email,
                                id: results.id,
                                barrundaid: results.currentbarrunda,
                                teamid: results.teamid
                            };
                            callback(null, activeAccount);
                        }else{
                            callback(ERROR_ENUM.BAD_CREDENTIALS, null);
                        }
                    });
                }
            });
        }
    }
}
