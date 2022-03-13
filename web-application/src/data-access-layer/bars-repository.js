const db = require('./db')

module.exports = function({}){

    return {
        storeBarRunda: (barRunda, account, callback) => {
            const query = `INSERT INTO barrunda (owner, data) VALUES (?,?)`;
            const values = [account.id, JSON.stringify(barRunda)];

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
                    callback(null, null);
                }

                else {
                    const values = [result[0].currentbarrunda];

                    db.query(qBarRunda, values, (error, result) => {
                        if (error) callback('Database error', null);
                        else {
                            if (!result.lenght) callback(null, null);
                            else callback(null, result[0]);
                        }
                    })
                }
            });
        },

        getBarrundaById: (id, callback) => {
            db.query('SELECT * FROM barrunda WHERE id = ?', id, (error, result) => {
                callback(error, result);
            })
        },

        deleteBarrundaById: (id, callback) => {

            // TODO: Remove this id from teams, users with this id as their barrunda.
            const query = `DELETE FROM barrunda WHERE id = ?`;
            const q2 = `UPDATE accounts SET currentbarrunda = NULL WHERE currentbarrunda = ?`;
            const q3 = `UPDATE teams SET currentbarrunda = NULL WHERE currentbarrunda = ?`
            db.query(query, id, (error, result) => {
                if (error) callback(error, null);
                else {
                    console.log('Delete query was successfull: ', result);
                    db.query(q2, id, (error, result,) => {
                        if (error) console.log('FAILED to remove barrunda id from user table after deleting barrunda ', error);
                        db.query(q3, id, (error, result) => {
                            if (error) console.log('FAILED to remove barrundaid from teams table after deleting barrunda', error);
                            callback(null, null);
                        });
                    });
                }
            });
        }
    }
}
