const db = require('./db')

exports.createAccount = function(account, callback){
	
	const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`
	const values = [account.username, account.email, account.password]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for usernameUnique violation.
			callback(['databaseError'], null)
		}else{
			callback(null, results.insertId)
		}
	})
	
}

exports.loginRequest = function(account, callback){
    
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [account.enteredUsername]

    db.query(query, values, function(error, accountFromDb){
		if(error)callback("Database error.", null)
        else if(accountFromDb)callback(null, accountFromDb[0])
        else callback("No account with that username", null)
	})
}