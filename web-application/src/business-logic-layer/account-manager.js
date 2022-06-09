const accountValidator = require('./account-validator')
const ERROR_ENUM = require('./models/error_enum');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const {ERROR_BCRYPT} = require("../business-logic-layer/models/error_enum")

module.exports = ({ accountRepository }) => {
    // Name all the dependencies in the curly brackets above.
    
    return {
        hasTeamCheck: (req, res, next) => {
            const { id } = req.account;
            console.log(id);
            accountRepository.getAccountById(id, (error, data) => {
                if (error || !data) return res.statsu(500).send({ error: SERVER_ERROR });
                if (data.team_id) {
                    res.status(403).send({
                        error: 'has_team_error',
                        error_description: "Gå till http://localhost:3000 och lämna ditt team för ta bort / skapa barrunda.",
                    });
                    return;
                }
                console.log('Has team check running next()');
                next();
            });
            console.log('End of has team check');
        },

        createAccount: (account, callback) => {

            // Validate the account.
            const errors = accountValidator.getErrorsNewAccount(account);
            
            if(errors.length){
                callback(errors[0], null);
                return;
            }

            bcrypt.hash(account.password, saltRounds, (error, hash) => {
                if (error) { 
                    callback(ERROR_BCRYPT, null);
                    return;
                }
                account.password = hash;
                accountRepository.createAccount(account, callback);
            });
        },

        getAccountByUsername: (account, callback) => {
            // Validate the login credentials.
            const errors = accountValidator.getErrorsLogin(account);

            if(errors.length){
                callback(errors[0], null);
                return;
            }

            accountRepository.getAccountByUsername(account, (error, accountFromDb) => {
                if(error) callback(error, null);
                else if (!accountFromDb) callback (ERROR_ENUM.BAD_CREDENTIALS, null);
                else {
                    bcrypt.compare(account.enteredPassword, accountFromDb.password, (error, result) => {
                        if(result){
                            //Deleting password due to security reasons.
                            delete accountFromDb.password
                            callback(null, accountFromDb);
                        }else{
                            callback(ERROR_ENUM.BAD_CREDENTIALS, null);
                        }
                    });
                }
            });
        }
    }
}
