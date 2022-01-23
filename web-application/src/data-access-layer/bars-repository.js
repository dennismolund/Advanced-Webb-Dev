const db = require('./db')

module.exports = function({}){

    return {
        storeBarRunda: (barRunda, account, callback) => {
            const selectQuery =  `SELECT Id FROM accounts WHERE username = ?`
            const query = `INSERT INTO barrunda (userid, data) VALUES (?, ?)`

            db.query(selectQuery, [account.username], (error, result) => {
                if (error) callback(error, null);

                else {
                    const values = [result[0].Id, JSON.stringify(barRunda)];
                    
                    db.query(query, values, (error, result) => {
                        if (error) callback(error, null);

                        else {
                            callback(result, null);
                        }
                    });
                }
            });
        },

        getBarRunda: (account, callback) => {
            const qId = `SELECT Id FROM accounts WHERE username = ?`;
            const qBarRunda = `SELECT * FROM barrunda WHERE userid = ?`;

            db.query(qId, [account.username], (error, result) => {
                if (error) callback(error, null);

                else {
                    const values = [result[0].Id];

                    db.query(qBarRunda, values, (error, result) => {
                        if (error) callback(error, null);

                        else {
                            console.log(result);
                            callback(null, result);
                        }
                    })
                }
            });
        }
    }
}
