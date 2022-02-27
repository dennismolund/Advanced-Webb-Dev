const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10
const MIN_PASSWORD_LENGTH = 3
const MAX_PASSWORD_LENGTH = 10

exports.getErrorsNewAccount = function(account){
	
	const errors = []
	
	// Validate username.
	if(!account.hasOwnProperty("username")){
		errors.push("Användarnamn saknas")
	}else if(account.username.length < MIN_USERNAME_LENGTH){
		errors.push("Användarnamn måste vara minst 3 tecken.")
	}else if(MAX_USERNAME_LENGTH < account.username.length){
		errors.push("Användarnamn är för långt")
	}

    if(!account.hasOwnProperty("password")){
		errors.push("Lösenord saknas")
	}else if(account.password.length < MIN_PASSWORD_LENGTH){
		errors.push("Lösenordet måste vara minst 3 tecken.")
	}else if(MAX_PASSWORD_LENGTH < account.password.length){
		errors.push("Lösenord är för långt")
	}else if(account.password != account.confirmationPassword){
		errors.push("Lösenorden matchar inte")
	}

    //Implement email validator.

	return errors
	
}

exports.getErrorsLogin = function(account){
    const errors = []
    console.log(account);
    if(!account.enteredUsername) errors.push("Användarnamn saknas")
    if(!account.enteredPassword) errors.push("Lösenord saknas")

    return errors
	
}
