const db = require('./db')

exports.createAccount = function(account, callback){
	
	const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`
	const values = [account.username, account.email, account.password]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for usernameUnique violation.
			callback(['databaseError'], null)
		}else{
			callback([], results.insertId)
		}
	})
	
}