const {
	USERNAME_TO_LONG,
	USERNAME_TO_SHORT,
	MISSING_USERNAME,
	MISSING_PASSWORD,
	PASSWORD_TO_LONG,
	PASSWORD_TO_SHORT,
	PASSWORD_NO_MATCH,
	INVALID_EMAIL_ADDRESS
} = require('./models/error_enum');
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 10;
const MIN_PASSWORD_LENGTH = 3;
const MAX_PASSWORD_LENGTH = 30;

exports.getErrorsNewAccount = function(account) {
	const errors = [];
	
	// Validate username.
	if (!account.hasOwnProperty("username")) {
		errors.push(MISSING_USERNAME);
	} else if (account.username.length < MIN_USERNAME_LENGTH) {
		errors.push(USERNAME_TO_SHORT);
	} else if (MAX_USERNAME_LENGTH < account.username.length) {
		errors.push(USERNAME_TO_LONG);
	}

    if (!account.hasOwnProperty("password")) {
		errors.push(MISSING_PASSWORD);
	} else if (account.password.length < MIN_PASSWORD_LENGTH) {
		errors.push(PASSWORD_TO_SHORT);
	} else if (MAX_PASSWORD_LENGTH < account.password.length) {
		errors.push(PASSWORD_TO_LONG);
	} else if (account.password != account.confirmationPassword) {
		errors.push(PASSWORD_NO_MATCH);
	}

	if (!account.hasOwnProperty("email")) {
		errors.push(MISSING_EMAIL);
	} else {
		var validRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (!account.email.match(validRegex)) {
			errors.push(INVALID_EMAIL_ADDRESS);
		}
	}

	return errors
	
}

exports.getErrorsLogin = function(account) {
    const errors = [];
    if (!account.enteredUsername) errors.push(MISSING_USERNAME);
    if (!account.enteredPassword) errors.push(MISSING_PASSWORD);

    return errors;
	
}