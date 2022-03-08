const express = require('express')
const { validTeamName } = require('./teams-validator');
const barlist = require('../models/bar.model')
const { validParams, validRows, parseResult } = require('./bars-validator');
const barsRepository = require('../data-access-layer/bars-repository');


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
            if (!id) callback('No team', null);
            else teamsRepository.getTeam(id, (errors, team, barrunda, teamMembers) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    
                    try {
                        console.log("Inside manager:", barrunda.data);
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
        updateTeamBarrunda: (teamid, account, barrundaid, callback) => {
            // Featch barrunda and check if account.id is owner id
            barsManager.deleteBarrundaById(barrundaid, account, (error, result) => {
                if (error) callback(error, null);
                else {
                    const barrunda = barlist.getRandom();
                    barsManager.storeBarRunda(barrunda, account, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            // Update members
                            console.log('Stored new barrunda: result');
                            console.log(result);
                            const data = {
                                id: result.insertId
                            };
                            teamsRepository.updateRundaForMembers(teamid, result.insertId, (error, result) => {
                                if (error) callback(error, null);
                                else callback(null, data);
                            });
                        }
                    });
                };
            });
        },
    }
}