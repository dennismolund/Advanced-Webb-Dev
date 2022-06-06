const db = require('./db')
const ERROR_ENUM = require('../models/error.enum');
module.exports = function({}){

    return {
        storeBarRunda: (barRunda, userId, callback) => {
            const query = `INSERT INTO pubcrawl (owner_id, data) VALUES (?,?)`;
            const values = [userId, JSON.stringify(barRunda)];

            db.query(query, values, (error, result) => {
                if (error) callback(error, null);
                else {
                    // Update user
                    const query = 'UPDATE account SET pubcrawl_id = ? WHERE id = ?';
                    const values = [result.insertId, userId];
                    db.query(query, values, (e, r) => {
                        if (e) console.log('Failed to update user after creating pubcrawl');
                    })
                    callback(null, result);
                }
            });
        },

        getBarRunda: (account, callback) => {
            const qBid = `SELECT pubcrawl_id FROM account WHERE username = ?`
            const qBarRunda = `SELECT * FROM pubcrawl WHERE id = ?`;

            db.query(qBid, [account.username], (error, result) => {
                if (error) callback(error, null);

                else if (!result[0].pubcrawl_id) {
                    callback(null, null);
                }

                else {
                    const values = [result[0].pubcrawl_id];

                    db.query(qBarRunda, values, (error, result) => {
                        if (error) callback(ERROR_ENUM.SERVER_ERROR, null);
                        else {
                            if (!result.lenght) callback(null, null);
                            else callback(null, result[0]);
                        }
                    })
                }
            });
        },

        getBarrundaById: (id, callback) => {
            db.query('SELECT * FROM pubcrawl WHERE id = ?', id, (error, result) => {
                callback(error, result);
            })
        },

        deleteBarrundaById: (id, callback) => {

            const query = `DELETE FROM pubcrawl WHERE id = ?`;
            const q2 = `UPDATE account SET pubcrawl_id = NULL WHERE pubcrawl_id = ?`;
            const q3 = `UPDATE team SET pubcrawl_id = NULL WHERE pubcrawl_id = ?`
            db.query(query, id, (error, result) => {
                if (error) callback(error, null);
                else {
                    console.log('Delete query was successfull: ', result);
                    db.query(q2, id, (error, result,) => {
                        if (error) console.log('FAILED to remove pubcrawl id from user table after deleting pubcrawl ', error);
                        db.query(q3, id, (error, result) => {
                            if (error) console.log('FAILED to remove pubcrawlid from  table after deleting pubcrawl', error);
                            callback(null, null);
                        });
                    });
                }
            });
        }
    }
}
