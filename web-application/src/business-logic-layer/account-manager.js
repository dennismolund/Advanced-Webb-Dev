const accountValidator = require('./account-validator')
const ERROR_ENUM = require('./models/error_enum');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = ({ accountRepository }) => {
    // Name all the dependencies in the curly brackets above.
    
    return {
        hasTeamCheck: (req, res, next) => {
            const { id } = req.account;
            console.log(id);
            accountRepository.getAccountById(id, (err, data) => {
                if (err || !data) return res.statsu(500).send({ error: SERVER_ERROR });
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

            bcrypt.hash(account.password, saltRounds, (err, hash) => {
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

            accountRepository.getAccountByUsername(account, (error, results) => {
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
                                pubcrawl_id: results.pubcrawl_id,
                                team_id: results.team_id
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
