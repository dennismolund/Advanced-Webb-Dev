const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback)=>{
            const query = `INSERT INTO teams (teamname, creatorid) VALUES (?, ?)`;
            const values = [team.teamName, team.creatorId];
            const q2 = `UPDATE accounts SET teamid = ? WHERE id = ?`;
            const q3 = `SELECT * FROM teams WHERE id = ?`;
            db.query(query, values, (error, result) => {
                if (error) {
                    console.log("Error in database: ", error);
                    callback('Internal server error', null);
                } else {
                    const v2 = [result.insertId, team.creatorId];
                    db.query(q2, v2, (error, result) => {
                        if (error) console.log('Error updating accounts table for creator after creating team.', error);
                    });
                    db.query(q3, result.insertId, (error, result) => {
                        
                        if (error) console.log('Error getting team after creating it', error);

                        callback(null, result[0])
                    });
                }
            });
        },
        deleteTeamById: (teamid, callback)=>{
            const query = `DELETE FROM teams WHERE id = ?`
		    const values = [teamid]
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("ERROR WHEN DELETING TEAM", error);
                    callback(error, null)
                }else{
                    const query2 = `UPDATE accounts SET teamid = ?, currentbarrunda = ? WHERE teamid = ?`
		            const values2 = [null, null, teamid]
                    db.query(query2, values2, (error, results)=>{
                        if(error){
                            console.log("ERROR WHEN UPDATING ACCOUNT", error);
                            callback(results, null)
                        }else callback(null, results)
                    })
                }
            })
            
        },
        leaveTeam: (accountId, callback) => {
            const query = `UPDATE accounts SET teamid = ?, currentbarrunda = ? WHERE id = ?`
            const values = [null, null, accountId]
            db.query(query, values, (error, results)=>{
                if(error){
                    callback(results, null)
                }else callback(null, results)
            })
        },
        joinTeam: (teamName, accountId, callback) => {
            const query = `SELECT * FROM teams WHERE teamname = ?`
            const q2 = `UPDATE accounts SET teamid = ? WHERE id = ?`;
		    const values = [teamName]
            
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("error in database (join team):", error);
                    callback(error, null)
                }else{
                    const teamid = result[0].id
                    const v2 = [result[0].id,accountId]
                    db.query(q2, v2, (error, result) => {
                        if(error){
                            console.log("error in database (join team):", error);
                            callback(error, null)
                        }else{
                            callback(null, teamid)
                        }
                    })
                }
            })
        },
        getTeam: (id, callback)=>{
            const query = `SELECT * FROM teams WHERE id = ?`
		    const values = [id]
            const q2 = `SELECT * FROM barrunda WHERE owner = ?`
            const q3 = `SELECT username FROM accounts WHERE teamid = ?`
            
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null, null, null)
                }else{
                    const team = result[0]
                    if (!team) callback('No team found', null, null, null);
                    else db.query(q2, result[0].creatorid, (error, result) => {
                        if(error){
                            console.log("error getTeam in repository", error);
                            callback(['databaseError'], null, null, null)
                        }
                        else {
                            console.log('Found barrundor?: ', result.length);
                            const barrunda = result.pop();
                            db.query(q3, values, (error, result) => {
                                if (error) {
                                    console.log("ERROR WHEN GETTING TEAMMEMBERS", error);
                                    callback(null, team, barrunda, null)
                                }else{
                                    const teamMembers = []
                                    result.forEach(element => {
                                        teamMembers.push(element.username)
                                    });
                                    
                                    callback(null, team, barrunda, teamMembers)
                                }   
                            })

                            
                        }
                    })
                    
                }
            })
        },
        updateRundaForMembers: (teamid, barrundaid, callback) => {
            console.log('settings barrunda id: ', barrundaid);
            const query = 'UPDATE accounts SET currentbarrunda = ? WHERE teamid = ?';
            const values = [barrundaid, teamid];
            db.query(query, values, (error, _) => {
                if (error) {
                    console.log(error);
                    callback('Error updating barrunda for team members', null);
                }
                else callback(null, null);
            });
        }
    }
}

