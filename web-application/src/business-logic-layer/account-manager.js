const accountValidator = require('./account-validator')
var bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = ({accountRepository}) => {
    // Name all the dependencies in the curly brackets above.
    
    return {
        getAllAccounts: (callback) => {
            accountRepository.getAllAccounts((errors, accounts) => {
                callback(errors, accounts);
            });
        },

        getAccountIdByUsername: (username, callback) => {
            accountRepository.getAccountIdByUsername(username, (errors, results) => {
                if(errors) callback(errors, null);
                else callback(null, results);
            });
        },

        createAccount: (account, callback) => {

            // Validate the account.
            const errors = accountValidator.getErrorsNewAccount(account);
            
            if(errors.length){
                console.log("Error");
                callback(errors, null);
                return;
            }

            bcrypt.hash(account.password, saltRounds, (err, hash) => {
                account.password = hash;

                accountRepository.createAccount(account, callback);
            });
        },

        loginRequest: (account, callback) => {
            // Validate the login credentials.
            console.log("account in manager:", account);
            const errors = accountValidator.getErrorsLogin(account);

            if(errors.length){
                callback(errors, null);
                return;
            }

            accountRepository.loginRequest(account, (errors, results) => {
                if(errors) callback(errors, null);
                else if (!results) callback (["Fel lösenord eller användarnamn"],null);
                else{
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
                            callback(["Fel lösenord eller användarnamn"], null);
                        }
                    });
                }
            });
        }
    }
}
