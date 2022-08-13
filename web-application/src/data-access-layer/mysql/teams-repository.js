const ERROR_ENUM = require('../error_enum');
const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback) => {
            const query = `INSERT INTO team (name, creator_id) VALUES (?, ?)`;
            const values = [team.teamName, team.creatorId];
            const query2 = `UPDATE account SET team_id = ? WHERE id = ?`;
            const query3 = `SELECT * FROM team WHERE id = ?`;
            db.query(query, values, (error, result) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        callback(ERROR_ENUM.TEAM_NAME_TAKEN, null);
                    } else callback(ERROR_ENUM.SERVER_ERROR, null);
                } else {
                    const value2 = [result.insertId, team.creatorId];
                    db.query(query2, value2, (error, result) => {
                        if (error) console.log('Error updating account table for creator after creating team.', error);
                    });
                    db.query(query3, result.insertId, (error, newTeam) => {
                        if (error) console.log('Error getting team after creating it', error);
                        callback(null, newTeam[0])
                    });
                }
            });
        },
        deleteTeamById: (team_id, callback)=>{
            const query = `UPDATE account SET team_id = ?, pubcrawl_id = ? WHERE team_id = ?`
		    const values = [null, null, team_id]
            db.query(query, values, (error, result) => {
                if(error){
                    callback(error, null)
                } else {
                    const query2 = `DELETE FROM team WHERE id = ?`
		            const values2 = [team_id]
                    db.query(query2, values2, (error, results) => {
                        if(error){
                            callback(ERROR_ENUM.SERVER_ERROR, null)
                        } else callback(null, null)
                    })
                }
            })
            
        },
        leaveTeam: (account_id, callback) => {
            const query = `UPDATE account SET team_id = ?, pubcrawl_id = ? WHERE id = ?`
            const values = [null, null, account_id]
            db.query(query, values, (error, results)=>{
                if(error){
                    callback(error, null)
                }else callback(null, null)
            })
        },
        joinTeam: (teamName, account_id, callback) => {
            const query = `SELECT * FROM team WHERE name = ?`;
            const query2 = `UPDATE account SET team_id = ? WHERE id = ?`;
		    const values = [teamName]
            
            db.query(query, values, (error, teamFromDb) => {
                if(error){
                    callback(ERROR_ENUM.SERVER_ERROR, null)
                } else {
                    if (!teamFromDb.length) {
                        callback(ERROR_ENUM.TEAM_NOT_FOUND, null);
                        return;
                    }
                    const team_id = teamFromDb[0].id
                    const value2 = [teamFromDb[0].id,account_id]
                    db.query(query2, value2, (error, result) => {
                        if(error){
                            callback(ERROR_ENUM.SERVER_ERROR, null)
                        }else{
                            callback(null, team_id)
                        }
                    })
                }
            })
        },
        getTeamById: (id, callback) => {
            const query = `SELECT * FROM team where id = ?`;
            const values = [id];
            db.query(query, values, (error, teams) => {
                if (error) {
                    callback(ERROR_ENUM.SERVER_ERROR, error);
                } else {
                    callback(null, teams[0]);
                }
            });
        },
        getTeam: (id, callback)=>{
            const query = `SELECT * FROM team WHERE id = ?`
		    const values = [id]
            const query2 = `SELECT * FROM pubcrawl WHERE owner_id = ?`
            const query3 = `SELECT username FROM account WHERE team_id = ?`
            
            db.query(query, values, (error, teamFromDb) => {
                if(error){
                    callback(['databaseError'], null, null, null)
                } else {
                    const team = teamFromDb[0]
                    if (!team) callback(TEAM_NOT_FOUND, null, null, null);
                    else db.query(query2, team.creator_id, (error, pubcrawlFromDb) => {
                        if(error){
                            callback(['databaseError'], null, null, null)
                        }
                        else {
                            const pubcrawl = pubcrawlFromDb.pop();
                            db.query(query3, values, (error, usernamesFromDb) => {
                                if (error) {

                                    callback(
                                        null,
                                        team.dataValues,
                                        pubcrawl.dataValues,
                                        null
                                    );
                                }else{
                                    const teamMembers = []
                                    usernamesFromDb.forEach(element => {
                                        teamMembers.push(element.username)
                                    });
                                    
                                    callback(null, team, pubcrawl, teamMembers)
                                }   
                            })

                            
                        }
                    })
                    
                }
            })
        },
        updatePubcrawlForMembers: (team_id, pubcrawlid, callback) => {
            const query = 'UPDATE account SET pubcrawl_id = ? WHERE team_id = ?';
            const values = [pubcrawlid, team_id];
            db.query(query, values, (error, _) => {
                if (error) {
                    callback(ERROR_ENUM.SERVER_ERROR, null);
                }
                else callback(null, null);
            });
        }
    }
}

