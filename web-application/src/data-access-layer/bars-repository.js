const { connect } = require('./db');
const db = require('./db')
const ERROR_ENUM = require('./models/error_enum');

module.exports = function({}){

    return {
        storePubcrawl: (pubcrawl, userId, callback) => {
            const query = `INSERT INTO pubcrawl (owner_id, data) VALUES (?,?)`;
            const values = [userId, JSON.stringify(pubcrawl)];
            db.beginTransaction((transactionError) => {
                if(transactionError) callback(transactionError, null);
                db.query(query, values, (error, result) => {
                    if (error) {
                        return db.rollback(() => {
                            callback(error, null);
                        });
                    }
                    else {
                        // Update user
                        const query = 'UPDATE account SET pubcrawl_id = ? WHERE id = ?';
                        const values = [result.insertId, userId];
                        db.query(query, values, (e, r) => {
                            if (e) {
                                console.log('Failed to update user after creating pubcrawl');
                                return db.rollback(() => {
                                    callback(error, null);
                                });
                            }
                        });
                        db.commit((commitError) => {
                            if(commitError){
                                return db.rollback(() => {
                                    callback(error, null);
                                });
                            }
                            callback(null, result);
                        })
                        
                    }
                });
            });
        },
        updatePubcrawlById: (id, pubcrawl, callback) => {
            const query = 'UPDATE pubcrawl SET data = ? WHERE id = ?';
            const values = [JSON.stringify(pubcrawl), id];

            db.query(query, values, (error, result) => {
                if (error) {
                    callback(error, null);
                    return;
                }
                callback(null, result);
            });
        },
        getPubcrawl: (account, callback) => {
            const qBid = `SELECT pubcrawl_id FROM account WHERE username = ?`
            const qPubcrawl = `SELECT * FROM pubcrawl WHERE id = ?`;

            db.query(qBid, [account.username], (error, pubcrawlIds) => {
                if (error) callback(error, null);
                else if (pubcrawlIds.length) {
                    const values = [pubcrawlIds[0].pubcrawl_id];
                    db.query(qPubcrawl, values, (error, pubcrawls) => {
                        if (error) callback(ERROR_ENUM.SERVER_ERROR, null);
                        else {
                            if (!pubcrawls.length) {callback(null, null);}
                            else callback(null, pubcrawls[0]);
                        }
                    })
                }
                else callback(null, null);
            });
        },
        getPubcrawlById: (id, callback) => {
            db.query(
                'SELECT * FROM pubcrawl WHERE id = ?',
                id,
                (error, pubcrawlFromDb) => {
                    callback(error, pubcrawlFromDb[0]);
                }
            );
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
