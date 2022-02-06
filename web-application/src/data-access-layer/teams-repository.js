const db = require('./db')

module.exports = function({}){

    return{
        
        createTeam: (team, callback)=>{
            const query = `INSERT INTO teams (teamname, creatorid) VALUES (?, ?)`
		    const values = [team.teamName, team.creatorId]
            
            db.query(query, values, function(error, results){
                if(error){
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null)
                }else{

                    const query2 = `INSERT INTO teams_users (teamid, userid) VALUES (?, ?)`
		            const values2 = [results.insertId, team.creatorId] 

                    db.query(query2, values2, function(error, result){
                        if(error){
                            console.log("Error in database: ", error);
                            callback(['databaseError'], null)
                        }else{
                            console.log("success, results:", result);
                            callback(null, result)
                        }
                    })
                    
                }
            })
        },
        getTeam: (user, callback)=>{
            const query = `SELECT * FROM teams WHERE creatorid = ?`
		    const values = [user]

            db.query(query, values, function(error, results){
                if(error){
                    console.log("Error in database: ", error);
                    callback(['databaseError'], null)
                }else{
                    console.log("success, results:", results);
                    callback(null, results)
                }
            })
        }
    }
}