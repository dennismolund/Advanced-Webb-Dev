const db = require('./db');

module.exports = function({}){
	// Name all the dependencies in the curly brackets above (none in this case). 
	
	const allAccounts = [];
	
	return {
	  getAllAccounts: (callback) => {
		callback([], allAccounts);
	  },

	  getAccountIdByUsername: (username, callback) => {
		const query = `SELECT id FROM accounts WHERE username = ?`;
		const values = [username];

		db.query(query, values, (error, results) => {
			if(error){
				console.log("Error in database: ", error);
				callback(['Internal server error'], null);
			}else{
				if (resluts.length) callback([`Found no user with username: ${username}`], null);
				else callback(null, results[0].id);
			}
		});
	  },
	  createAccount: (account, callback) => {
	
		const query = `INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)`;
		const values = [account.username, account.email, account.password];
		
		db.query(query, values, (error, results) => {
			if(error){
				// TODO: Look for usernameUnique violation.
				console.log("Error in database: ", error.code);
				if (error.code === "ER_DUP_ENTRY") callback(["Username is already taken"], null);
				else callback(['Internal server error'], null);
			}else{
				console.log("results.insertId:",results.insertId);
				callback(null, results.insertId);
			}
		})
		},
		loginRequest: (account, callback) => {
		
			const query = "SELECT * FROM accounts WHERE username = ?";
			const values = [account.enteredUsername];
		
			db.query(query, values, (error, accountFromDb) => {
				if(error) callback(["Internal server error"], null);

				else if(accountFromDb) callback(null, accountFromDb[0]);

				else callback("No account with that username", null);
			});
		}
	}
  }
