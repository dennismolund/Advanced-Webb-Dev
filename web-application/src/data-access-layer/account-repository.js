const db = require('./db')

module.exports = function({}){
	// Name all the dependencies in the curly brackets above (none in this case). 
	
	const allAccounts = []
	
	return {
	  getAllAccounts: function(callback){
		callback([], allAccounts)
	  },
	  getAccountIdByUsername: function(username, callback){
		console.log("inside, username:", username);
		const query = `SELECT id FROM accounts WHERE username = ?`
		const values = [username]

		db.query(query, values, function(error, results){
			if(error){
				console.log("Error in database: ", error);
				callback(['databaseError'], null)
			}else{
				console.log("results:", results[0].id);
				callback(null, results[0].id)
			}
		})

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
				console.log("results.insertId:",results.insertId);
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
