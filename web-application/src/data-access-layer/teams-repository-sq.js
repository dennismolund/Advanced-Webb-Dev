const { Sequelize } = require('sequelize');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');
const { response } = require('express');


const errHandler = (err) =>{
    console.error("Error: ", err);
    
}

module.exports = ({}) => {
    

    return{
        
        createTeam: async (team, callback) => {
            var newTeam
            try {
                newTeam = await Team.create({
                    teamname: team.teamName,
                    creatorid: team.creatorId
                })
            } catch (error) {
                console.log("ERROR: " , error);
            } finally {
                await Account.update({ teamid: newTeam.dataValues.id }, {
                    where: {
                      id: team.creatorId
                    }
                  }).catch(errHandler)

                await Team.findAll({
                    where: {
                    id: newTeam.dataValues.id
                    }
                }).then( (teamfound) => {
                    callback(null, teamfound[0].dataValues)
                })
            }
                
            
        },

        getTeam: async (id, callback) => {

            
            await Team.findAll({
                where: {
                id: id
                }
            }).catch(errHandler).then( async(teamFound) => {
                const team = teamFound[0]
                await Barrunda.findAll({
                    where: {
                    owner: team.dataValues.creatorid
                    }
                }).catch(errHandler).then( async (barrundaFound) => {
                    const barrunda = barrundaFound.pop()
                    console.log("barrundaFound:", barrunda.get({
                        plain: true
                      }))
                    await Account.findAll({
                        where: {
                            teamid: id
                        }
                    }).catch(errHandler).then( (membersFound) => {
                        const teamMembers = []
                        membersFound.forEach(element => {
                                        teamMembers.push(element.dataValues.username)
                                    });
                        callback(null, team, barrunda, teamMembers)
                    })
                })
            })

        },
        deleteTeamById: async (teamid, callback) => { 
            await Team.destroy({
                where: {
                  id: teamid
                }
              }).then ( async () => {
                    await Account.update({ teamid: null , currentbarrunda: null }, {
                        where: {
                        teamid: teamid
                        }
                    }).catch(errHandler).then((result) =>{
                        callback(null, result)
                    })
              })
        },
        leaveTeam: async (accountId, callback) => {
            await Account.update({ teamid: null , currentbarrunda: null }, {
                where: {
                id: accountId
                }
            }).catch(errHandler).then((result) =>{
                callback(null, result)
            })
        },
        joinTeam: async (teamName, accountId, callback) => {
            await Team.findAll({
                where: {
                teamName: teamName
                }
            }).then( async (teamFound) => {
                //Vi kanske behöver updatera currentbarrunda också? Vi har inte gjort det i den andra filen heller.
                await Account.update({ teamid: teamFound[0].dataValues.id }, {
                    where: {
                    id: accountId
                    }
                }).catch(errHandler).then((result) =>{
                    callback(null, result)
                })
            })
        }
        //TODO: updateRundaForMemebers
    }
}
