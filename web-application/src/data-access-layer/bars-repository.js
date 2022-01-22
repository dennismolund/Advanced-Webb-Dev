const db = require('./db')

module.exports = function({}){

    return {
        storeBarRunda: async (barRunda, account)=>{
            const selectQuery =  `SELECT * FROM accounts WHERE username = ?`
            const query = `INSERT INTO barrunda (userid, data) VALUES (?, ?)`
            const uID = await db.query(selectQuery, [account.username], async (error, results)=>{
                if(error){
                    console.log("ERROR:", error);
                }else return results
            })
            console.log("uid", uID);
            const values = [uID, barRunda]
            const result = await db.query(query, values)
            return result
        }
    }
}
