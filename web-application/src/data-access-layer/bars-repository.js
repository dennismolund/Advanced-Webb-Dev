const db = require('./db')

module.exports = function({}){

    return {
        storeBarRunda: (barRunda, account, callback) => {
            const query = `INSERT INTO barrunda (data) VALUES (?)`;
            const values = [JSON.stringify(barRunda)];

            db.query(query, values, (error, result) => {
                if (error) callback(error, null);
                else {
                    // Update user
                    const query = 'UPDATE accounts SET currentbarrunda = ? WHERE username = ?';
                    const values = [result.insertId, account.username];
                    db.query(query, values, (e, r) => {
                        if (e) console.log('failed to update current barrunda for user: ', account.username);
                    })
                    callback(null, result);
                }
            });
        },

        getBarRunda: (account, callback) => {
            const qBid = `SELECT currentbarrunda FROM accounts WHERE username = ?`
            const qBarRunda = `SELECT * FROM barrunda WHERE id = ?`;

            db.query(qBid, [account.username], (error, result) => {
                if (error) callback(error, null);

                else if (!result[0].currentbarrunda) {
                    callback(null, []);
                }

                else {
                    const values = [result[0].currentbarrunda];

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
