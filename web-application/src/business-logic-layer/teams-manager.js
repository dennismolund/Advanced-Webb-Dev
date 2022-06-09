const express = require('express');
const { validTeamName } = require('./teams-validator');
const barlist = require('./models/pubcrawlFactory')
const { validParams, validRows, parseResult } = require('./bars-validator');
const barsRepository = require('../data-access-layer/bars-repository');
const { getPlaces } = require('../data-access-layer/service/fetch.data.service');
const {JOIN_TEAM_NOT_EXIST, TEAM_NAME_TAKEN} = require('../business-logic-layer/models/error_enum')

module.exports = function({ teamsRepository, barsManager }){

    return {
        createTeam: function(team, account, callback){
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
                return;
            }
            teamsRepository.createTeam(team, async (error, newTeam) => {
                if (error) {
                    console.log("Errors in teams-manager:", error);
                    if (error.code === 'ER_DUP_ENTRY') error.message = TEAM_NAME_TAKEN;
                    callback(error.message, null);
                } else {
                    // Create new barrund for team.
                    await getPlaces();
                    const pubcrawl = barlist.getRandom();
                    barsManager.storePubcrawl(pubcrawl, account.id, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            const data = {
                                team: newTeam,
                                pubcrawl: result,
                            };
                            callback(null, data);
                        }
                    });
                }
            })
        },
        delete: (sessionUserId, teamId, callback) => {
            teamsRepository.getTeamById(teamId, (error, team) => {
                if (sessionUserId == team?.creator_id) {
                    teamsRepository.deleteTeamById(teamId, (error, result) => {
                        if (error) callback(error, null);
                        else callback(null, null);
                    });
                } else {
                    console.log('LEAVING TEAM');
                    teamsRepository.leaveTeam(sessionUserId, (error, result) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, null);
                        }
                    })
                }
            });
        },
        joinTeam: (teamName, accountId, callback) => {
            teamsRepository.joinTeam(teamName, accountId, (error, results) => {
                if(error){
                    error = JOIN_TEAM_NOT_EXIST
                    callback(error, null)
                }else{
                    callback(null, results)
                }
            })
        },
        getTeam: (id, callback) => {
            //error handling
            if (!id) {
                callback('No team', null);
                return;
            }
            teamsRepository.getTeam(id, (errors, team, pubcrawl, teamMembers) => {
                if (errors) {
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null);
                } else {
                    
                    try {
                        const parsed = parseResult(pubcrawl.data);
                        
                        const bars = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: bars,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    } catch (e) {
                        //Using sequilze the data is already parsed
                        const parsed = pubcrawl.data;
                        
                        const bars = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: bars,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    }
                    

                    
                }
            })
        },
        updateTeamPubcrawl: (team_id, account, pubcrawl_id, callback) => {
            // Featch pubcrawl and check if account.id is owner id
            barsManager.deletePubcrawlById(pubcrawl_id, account, async (error, result) => {
                if (error) callback(error, null);
                else {
                    await getPlaces();
                    const pubcrawl = barlist.getRandom();
                    barsManager.storePubcrawl(pubcrawl, account.id, (error, result) => {
                        if (error) callback(error, null);
                        else {
                            // Update members
                            console.log('Stored new pubcrawl');
                            const data = {
                                id: result.insertId
                            };
                            teamsRepository.updatePubcrawlForMembers(team_id, result.insertId, (error, result) => {
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