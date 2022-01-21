const db = require('./db')

module.exports = function({}){
	// Name all the dependencies in the curly brackets above (none in this case). 
	
	const allAccounts = []
	
	return {
	  getAllAccounts: function(callback){
		callback([], allAccounts)
	  },
	  createAccount: function(account, callback){
	
		const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`
		const values = [account.username, account.email, account.password]
		
		db.query(query, values, function(error, results){
			if(error){
				// TODO: Look for usernameUnique violation.
				console.log("Error in database: ", error);
				callback(['databaseError'], null)
			}else{
				callback(null, results.insertId)
			}
		})
	},
	loginRequest: function(account, callback){
    
		const query = "SELECT * FROM accounts WHERE username = ?"
		const values = [account.enteredUsername]
	
		db.query(query, values, function(error, accountFromDb){
			if(error)callback("Database error.", null)
			else if(accountFromDb)callback(null, accountFromDb[0])
			else callback("No account with that username", null)
		})
	}

	  
	}
	
  }
