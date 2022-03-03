const express = require('express')
const { validTeamName } = require('./teams-validator');
const barlist = require('../models/bar.model')
const { validParams, validRows, parseResult } = require('./bars-validator');


module.exports = function({ teamsRepository, barsManager }){

    return {
        createTeam: function(team, account, callback){
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
            }
            teamsRepository.createTeam(team, (errors, newTeam) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    // Create new barrund for team.
                    const barrunda = barlist.getRandom();
                    barsManager.storeBarRunda(barrunda, account, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            const data = {
                                team: newTeam,
                                barrunda: result,
                            };
                            callback(null, data);
                        }
                    });
                }
            })
        },
        delete: (team, callback) => {

            if(team.teamowner == team.userid){
                teamsRepository.deleteTeamById(team.teamid, (error, result) => {
                    if(error){
                        callback(error, null)
                    }else{
                        callback(null, result)
                    }
                });
            }else{
                teamsRepository.leaveTeam(team.userid, (error, result) => {
                    if(error){
                        callback(error, null)
                    }else{
                        callback(null, result)
                    }
                })
            }
            
        },
        joinTeam: (teamName, accountId, callback) => {
            teamsRepository.joinTeam(teamName, accountId, (errors, results)=>{
                if(errors){
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            })
        },
        getTeam: (id, callback) => {
            //error handling
            teamsRepository.getTeam(id, (errors, team, barrunda, teamMembers) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    
                    try {
                        
                        const parsed = parseResult(barrunda.data);
                        
                        const bars = {
                            parsed,
                            raw: barrunda,
                        }
                        const data = {
                            team: team,
                            barrunda: bars,
                            teamMembers: teamMembers
                        };
                        
                        callback(null, data)
                    } catch (e) {
                        console.log("error",e);
                        callback(new Error('Failed to parse data'), null);
                    }
                    

                    
                }
            })
        },
        updateTeamBarrunda: (activeAccount, currentbarrunda, callback) => {
            teamsRepository.updateTeamBarrunda(activeAccount, currentbarrunda, (errors, results) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            })
        }
    }
}