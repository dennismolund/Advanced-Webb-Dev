const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

module.exports = function({accountRepository}){
    // Name all the dependencies in the curly brackets above.
    
    return {
      getAllAccounts: function(callback){
        accountRepository.getAllAccounts(function(errors, accounts){
          callback(errors, accounts)
        })
      },
      createAccount: function(account, callback){

        // Validate the account.
        const errors = accountValidator.getErrorsNewAccount(account)
        
        if(0 < errors.length){
            console.log("Error");
            callback(errors, null)
            return
        }
        accountRepository.createAccount(account, callback)  
    },
    loginRequest: function(account, callback){
        // Validate the login credentials.
        console.log("account in manager:", account);
        const errors = accountValidator.getErrorsLogin(account)
    
        if(0 < errors.length){
            callback(errors, null)
            return
        }
    
        accountRepository.loginRequest(account, function(errors, results){
            if(errors) callback(errors, null)
            else if (!results) callback (["Fel lösenord eller användarnamn"],null)
            else{
                if(account.enteredPassword != results.password){
                    callback(["Fel lösenord eller användarnamn"], null)
                }else{
                    //Only sending back username and email, excluding Id and password due to security.
                    const activeAccount = {
                        username: results.username,
                        email: results.email
                    }
                    callback(null, activeAccount)
                }
            }
        })
    
    }


    }
  }
