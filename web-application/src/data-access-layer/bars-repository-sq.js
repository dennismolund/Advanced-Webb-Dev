const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('webAppDatabase', 'root', 'jade123', {
    host: 'database',
    dialect: 'mysql'
  });

const a = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
a()
  
  module.exports = function({}){

    return {
        storeBarRunda: (barRunda, account, callback) => {
            const query = `INSERT INTO barrunda (owner, data) VALUES (?,?)`;
            const values = [account.id, JSON.stringify(barRunda)];

            sequelize.query(query, values, (error, result) => {
                if (error) callback(error, null);
                else {
                    // Update user
                    const query = 'UPDATE accounts SET currentbarrunda = ? WHERE username = ?';
                    const values = [result.insertId, account.username];
                    sequelize.query(query, values, (e, r) => {
                        if (e) console.log('failed to update current barrunda for user: ', account.username);
                    })
                    callback(null, result);
                }
            });
        },

        getBarRunda: (account, callback) => {
            const qBid = `SELECT currentbarrunda FROM accounts WHERE username = ?`
            const qBarRunda = `SELECT * FROM barrunda WHERE id = ?`;

            sequelize.query(qBid, [account.username], (error, result) => {
                if (error) callback(error, null);

                else if (!result[0].currentbarrunda) {
                    callback(null, []);
                }

                else {
                    const values = [result[0].currentbarrunda];

                    sequelize.query(qBarRunda, values, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            callback(null, result);
                        }
                    })
                }
            });
        },

        getBarrundaById: (id, callback) => {
            sequelize.query('SELECT * FROM barrunda WHERE id = ?', id, (error, result) => {
                callback(error, result);
            })
        },

        deleteBarrundaById: (id, callback) => {

            // TODO: Remove this id from teams, users with this id as their barrunda.
            const query = `DELETE FROM barrunda WHERE id = ?`;
            const q2 = `UPDATE accounts SET currentbarrunda = NULL WHERE currentbarrunda = ?`;
            const q3 = `UPDATE teams SET currentbarrunda = NULL WHERE currentbarrunda = ?`
            sequelize.query(query, id, (error, result) => {
                if (error) callback(error, null);
                else {
                    console.log('Delete query was successfull: ', result);
                    sequelize.query(q2, id, (error, result,) => {
                        if (error) console.log('FAILED to remove barrunda id from user table after deleting barrunda ', error);
                        sequelize.query(q3, id, (error, result) => {
                            if (error) console.log('FAILED to remove barrundaid from teams table after deleting barrunda', error);
                            callback(null, null);
                        });
                    });
                }
            });
        }
    }
}
