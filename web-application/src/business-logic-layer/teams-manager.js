const express = require('express')
const { validTeamName } = require('./teams-validator');
const barlist = require('../models/bar.model')


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
        delete: (teamid, callback) => {
            teamsRepository.delete(teamid, (errors, results) => {
                if(errors){
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            });
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
            teamsRepository.getTeam(id, (errors, results) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    callback(null, results)
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