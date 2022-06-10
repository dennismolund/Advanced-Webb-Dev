const db = require('./db')
const ERROR_ENUM = require('../business-logic-layer/models/error_enum');
module.exports = function({}){

    return {
        storePubcrawl: (pubcrawl, userId, callback) => {
            const query = `INSERT INTO pubcrawl (owner_id, data) VALUES (?,?)`;
            const values = [userId, JSON.stringify(pubcrawl)];

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

        getPubcrawl: (account, callback) => {
            const qBid = `SELECT pubcrawl_id FROM account WHERE username = ?`
            const qPubcrawl = `SELECT * FROM pubcrawl WHERE id = ?`;

            db.query(qBid, [account.username], (error, pubcrawlId) => {
                if (error) callback(error, null);
                else if (!pubcrawlId[0].pubcrawl_id) callback(null, null);
                else {
                    const values = [pubcrawlId[0].pubcrawl_id];
                    console.log("id:", pubcrawlId[0].pubcrawl_id);
                    db.query(qPubcrawl, values, (error, pubcrawl) => {
                        if (error) callback(ERROR_ENUM.SERVER_ERROR, null);
                        else {
                            console.log("result from db:", pubcrawl[0].length);
                            if (!pubcrawl.length) {callback(null, null);}
                            else callback(null, pubcrawl[0]);
                        }
                    })
                }
            });
        },

        getPubcrawlById: (id, callback) => {
            db.query('SELECT * FROM pubcrawl WHERE id = ?', id, (error, pubcrawlFromDb) => {
                callback(error, pubcrawlFromDb);
            })
        },

        deletePubcrawlById: (id, callback) => {
            const query = `DELETE FROM pubcrawl WHERE id = ?`;
            db.query(query, id, (error, result) => {
                if (error) callback(error, null);
                else callback(null, null);
            });
        }
    }
}
