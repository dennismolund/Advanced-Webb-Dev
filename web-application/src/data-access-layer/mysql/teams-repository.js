const ERROR_ENUM = require('../error_enum');
const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback) => {
            const query = `INSERT INTO team (teamname, creator_id) VALUES (?, ?)`;
            const values = [team.teamName, team.creatorId];
            const query2 = `UPDATE account SET team_id = ? WHERE id = ?`;
            const query3 = `SELECT * FROM team WHERE id = ?`;
            db.query(query, values, (error, result) => {
                if (error) {
                    console.log("Error in database: ", error);
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
                    console.log("ERROR WHEN UPDATING ACCOUNT", error);
                    callback(error, null)
                } else {
                    const query2 = `DELETE FROM team WHERE id = ?`
		            const values2 = [team_id]
                    db.query(query2, values2, (error, results) => {
                        if(error){
                            console.log("ERROR WHEN DELETING TEAM", error);
                            callback('Error deleting team', null)
                        } else callback(null, null)
                    })
                }
            })
            
        },
        leaveTeam: (accountId, callback) => {
            const query = `UPDATE account SET team_id = ?, pubcrawl_id = ? WHERE id = ?`
            const values = [null, null, accountId]
            db.query(query, values, (error, results)=>{
                if(error){
                    callback(error, null)
                }else callback(null, null)
            })
        },
        joinTeam: (teamName, accountId, callback) => {
            const query = `SELECT * FROM team WHERE teamname = ?`;
            const query2 = `UPDATE account SET team_id = ? WHERE id = ?`;
		    const values = [teamName]
            
            db.query(query, values, (error, teamFromDb) => {
                if(error){
                    console.log("error in database (join team):", error);
                    callback(ERROR_ENUM.SERVER_ERROR, null)
                } else {
                    if (!teamFromDb.length) {
                        callback(ERROR_ENUM.TEAM_NOT_FOUND, null);
                        return;
                    }
                    const team_id = teamFromDb[0].id
                    const value2 = [teamFromDb[0].id,accountId]
                    db.query(query2, value2, (error, result) => {
                        if(error){
                            console.log("error in database (join team):", error);
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
                    console.log(error);
                    callback('error in database: ', error);
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
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null, null, null)
                } else {
                    const team = teamFromDb[0]
                    console.log("team in teams repo:", team);
                    if (!team) callback('No team found', null, null, null);
                    else db.query(query2, team.creator_id, (error, pubcrawlFromDb) => {
                        if(error){
                            console.log("error getTeam in repository", error);
                            callback(['databaseError'], null, null, null)
                        }
                        else {
                            console.log('Found barrundor?: ', pubcrawlFromDb.length);
                            const pubcrawl = pubcrawlFromDb.pop();
                            db.query(query3, values, (error, usernamesFromDb) => {
                                if (error) {
                                    console.log("ERROR WHEN GETTING TEAMMEMBERS", error);
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
            console.log('settings pubcrawl id: ', pubcrawlid);
            const query = 'UPDATE account SET pubcrawl_id = ? WHERE team_id = ?';
            const values = [pubcrawlid, team_id];
            db.query(query, values, (error, _) => {
                if (error) {
                    console.log(error);
                    callback('Error updating pubcrawl for team members', null);
                }
                else callback(null, null);
            });
        }
    }
}

