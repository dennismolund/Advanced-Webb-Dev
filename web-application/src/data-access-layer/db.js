const mysql = require('mysql');

const connection = mysql.createConnection({
	host : 'database',
	user : 'root',
	password : 'jade123',
	database : 'webAppDatabase'
});

module.exports = connection;