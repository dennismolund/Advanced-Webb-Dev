const express = require('express')
const { validTeamName } = require('./teams-validator');
const barlist = require('../models/bar.model')
const { validParams, validRows, parseResult } = require('./bars-validator');
const barsRepository = require('../data-access-layer/bars-repository');
const { getPlaces } = require('../service/fetch.data.service');

module.exports = function({ teamsRepository, barsManager }){

    return {
        createTeam: function(team, account, callback){
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
            }
            teamsRepository.createTeam(team, async (errors, newTeam) => {
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    // Create new barrund for team.
                    await getPlaces();
                    const barrunda = barlist.getRandom();
                    barsManager.storeBarRunda(barrunda, account.id, (error, result) => {
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
                        callback(null, null)
                    }
                });
            }else{
                teamsRepository.leaveTeam(team.userid, (error, result) => {
                    if(error){
                        callback(error, null)
                    }else{
                        callback(null, null)
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
                        //Using sequilze the data is already parsed
                        const parsed = barrunda.data;
                        
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
                    }
                    

                    
                }
            })
        },
        updateTeamBarrunda: (teamid, account, barrundaid, callback) => {
            // Featch barrunda and check if account.id is owner id
            barsManager.deleteBarrundaById(barrundaid, account, async (error, result) => {
                if (error) callback(error, null);
                else {
                    await getPlaces();
                    const barrunda = barlist.getRandom();
                    barsManager.storeBarRunda(barrunda, account.id, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            // Update members
                            console.log('Stored new barrunda');
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