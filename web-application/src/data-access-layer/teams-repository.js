const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback)=>{
            const query = `INSERT INTO teams (teamname, creatorid) VALUES (?, ?)`;
            const values = [team.teamName, team.creatorId];
            const q2 = 'UPDATE accounts SET teamid = ? WHERE id = ?';
            const q3 = 'SELECT * FROM teams WHERE id = ?';
            db.query(query, values, (error, result) => {
                if(error){
                    console.log("Error in database: ", error);
                    callback('Internal server error', null);
                }else{
                    const v2 = [result.id, team.creatorId];
                    db.query(q2, v2, (error, result) => {
                        if (error) console.log('Error updating accounts table for creator after creating team.', error);
                    });
                    db.query(q3, result.id, (error, result) => {
                        if (error) console.log('Error getting team after creating it');
                        console.log('Got team: ', result);
                        callback(null, result)
                    });
                }
            });
        },
        //ById lägg till sen.
        delete: (teamid, callback)=>{
            const query = `DELETE FROM teams WHERE id = ?`
		    const values = [teamid]
            db.query(query, values, (error, results)=>{
                if(error){
                    callback(error, null)
                }else{
                    const query2 = `DELETE FROM accounts WHERE teamid = ?`
		            const values2 = [teamid]
                    db.query(query2, values2, (error, results)=>{
                        if(error){
                            callback(results, null)
                        }else callback(null, results)
                    })
                    
                }
            })
            
        },
        joinTeam: (teamName, accountId, callback)=>{
            const query = `SELECT * FROM teams WHERE teamname = ?`
		    const values = [teamName]

            db.query(query, values, (error, results)=>{
                if(error){
                    callback(error, null)
                }else{
                    const teamId = results[0].id
                    const currentbarrunda = results[0].currentbarrunda

                    const query2 = `UPDATE accounts SET teamid = ?, currentbarrunda = ? where WHERE id = ?`
		            const values2 = [teamId,currentbarrunda, accountId]
                    db.query(query2, values2, (error, results)=>{
                        if(error){
                            callback(results, null)
                        }else {
                            callback(null, results)
                        }
                    })
                    
                }
            })
        },
        getTeam: (creatorId, callback)=>{
            const query = `SELECT * FROM teams WHERE creatorid = ?`
		    const values = [creatorId]

            db.query(query, values, (error, results)=>{
                if(error){
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null)
                }else{
                    callback(null, results[0])
                }
            })
        },
        updateTeamBarrunda: (activeAccount, currentbarrunda, callback) => {
            const query = `UPDATE teams SET currentbarrunda = ? WHERE id = ?`
		    const values = [currentbarrunda]
        }
    }
}

