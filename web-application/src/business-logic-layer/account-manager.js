const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

exports.createAccount = function(account, callback){

	// Validate the account.
	const errors = accountValidator.getErrorsNewAccount(account)
	
	if(0 < errors.length){
        console.log("Error");
		callback(errors, null)
		return
	}
	
	accountRepository.createAccount(account, callback)
	
}

exports.loginRequest = function(account, callback){
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
            }else callback(null, results)
        }
    })

}