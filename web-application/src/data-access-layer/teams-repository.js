const ERROR_ENUM = require('../business-logic-layer/models/error_enum');
const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback) => {
            const query = `INSERT INTO team (teamname, creator_id) VALUES (?, ?)`;
            const values = [team.teamName, team.creatorId];
            const q2 = `UPDATE account SET team_id = ? WHERE id = ?`;
            const q3 = `SELECT * FROM team WHERE id = ?`;
            db.query(query, values, (error, result) => {
                if (error) {
                    console.log("Error in database: ", error);
                    const err = {
                        code: error.code,
                        message: ERROR_ENUM.SERVER_ERROR
                    };
                    callback(err, null);
                } else {
                    const v2 = [result.insertId, team.creatorId];
                    db.query(q2, v2, (error, result) => {
                        if (error) console.log('Error updating account table for creator after creating team.', error);
                    });
                    db.query(q3, result.insertId, (error, result) => {
                        
                        if (error) console.log('Error getting team after creating it', error);

                        callback(null, result[0])
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
                }else{
                    const query2 = `DELETE FROM team WHERE id = ?`
		            const values2 = [team_id]
                    db.query(query2, values2, (error, results)=>{
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
            const q2 = `UPDATE account SET team_id = ? WHERE id = ?`;
		    const values = [teamName]
            
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("error in database (join team):", error);
                    callback(error, null)
                } else {
                    if (!result.length) {
                        callback('No team found', null);
                        return;
                    }
                    const team_id = result[0].id
                    const v2 = [result[0].id,accountId]
                    db.query(q2, v2, (error, result) => {
                        if(error){
                            console.log("error in database (join team):", error);
                            callback(error, null)
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
                    callback(null, teams[0]?.dataValues);
                }
            });
        },
        getTeam: (id, callback)=>{
            const query = `SELECT * FROM team WHERE id = ?`
		    const values = [id]
            const q2 = `SELECT * FROM pubcrawl WHERE owner_id = ?`
            const q3 = `SELECT username FROM account WHERE team_id = ?`
            
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null, null, null)
                } else {
                    const team = result[0]
                    console.log("team in teams repo:", team);
                    if (!team) callback('No team found', null, null, null);
                    else db.query(q2, result[0].creator_id, (error, result) => {
                        if(error){
                            console.log("error getTeam in repository", error);
                            callback(['databaseError'], null, null, null)
                        }
                        else {
                            console.log('Found barrundor?: ', result.length);
                            const pubcrawl = result.pop();
                            db.query(q3, values, (error, result) => {
                                if (error) {
                                    console.log("ERROR WHEN GETTING TEAMMEMBERS", error);
                                    callback(null, team.dataValues, pubcrawl.dataValues, null)
                                }else{
                                    const teamMembers = []
                                    result.forEach(element => {
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

