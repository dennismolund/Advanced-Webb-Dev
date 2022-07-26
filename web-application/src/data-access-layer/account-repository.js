const db = require('./db');
const ERROR_ENUM = require('./models/error_enum');

module.exports = function({}){
	// Name all the dependencies in the curly brackets above (none in this case). 
	return {
	  getAccountById: (id, callback) => {
		  const query = 'SELECT * FROM account WHERE id = ?';
		  const values = [id];
		  db.query(query, values, (error, accounts) => {
			if (error) {
				console.log('Error getting acocunt from db: ', error);
				callback(ERROR_ENUM.SERVER_ERROR, null);
				return;
			}
			callback(null, accounts[0]);
		  });
	  },

	  createAccount: (account, callback) => {
		const query = `INSERT INTO account (username, email, password) VALUES (?, ?, ?)`;
		const values = [account.username, account.email, account.password];
		
		db.query(query, values, (error, results) => {
			if(error){
				console.log("Error in database: ", error.code);
				if (error.code === "ER_DUP_ENTRY") {
					if (error.sqlMessage.includes('email')) {
						callback(ERROR_ENUM.EMAIL_TAKEN, null);
						return;
					}
					callback(ERROR_ENUM.USERNAME_TAKEN, null);
				}
				else callback(ERROR_ENUM.SERVER_ERROR, null);
			}else{
				callback(null, results.insertId);
			}
		})
		},
		getAccountByUsername: (account, callback) => {
		
			const query = "SELECT * FROM account WHERE username = ?";
			const values = [account.enteredUsername];
		
			db.query(query, values, (error, accounts) => {
				if(error) callback(ERROR_ENUM.SERVER_ERROR, null);

				else if(accounts) callback(null, accounts[0]);

				else callback(ERROR_ENUM.USER_NOT_FOUND, null);
			});
		}
	}
  }
