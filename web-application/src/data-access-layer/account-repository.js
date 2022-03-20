const db = require('./db');
const ERROR_ENUM = require('../models/error.enum');

module.exports = function({}){
	// Name all the dependencies in the curly brackets above (none in this case). 
	
	const allAccounts = [];
	
	return {
	  getAccountIdByUsername: (username, callback) => {
		const query = `SELECT id FROM accounts WHERE username = ?`;
		const values = [username];

		db.query(query, values, (error, results) => {
			if(error){
				console.log("Error in database: ", error);
				callback(ERROR_ENUM.SERVER_ERROR, null);
			}else{
				if (resluts.length) callback(ERROR_ENUM.USER_NOT_FOUND, null);
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
				if (error.code === "ER_DUP_ENTRY") callback(ERROR_ENUM.USERNAME_TAKEN, null);
				else callback(ERROR_ENUM.SERVER_ERROR, null);
			}else{
				callback(null, results.insertId);
			}
		})
		},
		loginRequest: (account, callback) => {
		
			const query = "SELECT * FROM accounts WHERE username = ?";
			const values = [account.enteredUsername];
		
			db.query(query, values, (error, accountFromDb) => {
				if(error) callback(ERROR_ENUM.SERVER_ERROR, null);

				else if(accountFromDb) callback(null, accountFromDb[0]);

				else callback(ERROR_ENUM.USER_NOT_FOUND, null);
			});
		}
	}
  }
