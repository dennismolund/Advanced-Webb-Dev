const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

exports.createAccount = function(account, callback){

	// Validate the account.
	const errors = accountValidator.getErrorsNewAccount(account)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
	
	accountRepository.createAccount(account, callback)
	
}