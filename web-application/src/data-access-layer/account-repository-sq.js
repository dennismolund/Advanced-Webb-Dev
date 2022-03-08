const { Sequelize } = require('sequelize');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');


const errHandler = (err) =>{
    console.error("Error: ", err);
    
}

module.exports = ({}) => { 

    //TODO: HANDLE ERRORS
    return{
        createAccount: async (account, callback) => {

            await Account.create({
                username: account.username,
                email: account.email,
                password: account.password
            }).catch(errHandler).then( (newAccount) => {
                callback(null, newAccount.dataValues.id)
            })
        },
        loginRequest: async (account, callback) => { 
            await Account.findAll({
                where: {
                username: account.enteredUsername
                }
        }).catch(errHandler).then( (accountFound) => {
            
            callback(null, accountFound[0].dataValues)
        })

    },
    getAccountIdByUsername: async (username, callback) => {
        await Account.findAll({
            where: {
            username: username
            }
    }).catch(errHandler).then( (accountFound) => {
        callback(null, accountFound[0].dataValues.id)
    })
    }
}
    
}