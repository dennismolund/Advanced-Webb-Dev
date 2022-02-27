const express = require('express')
const { validTeamName } = require('./teams-validator');

module.exports = function({teamsRepository}){

    return {
        createTeam: function(team, callback){
            //error handling
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
            }
            teamsRepository.createTeam(team, function(errors, results){
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    console.log(results);
                    callback(null, results)
                }
            })
        },
        delete: function(teamid, callback){
            teamsRepository.delete(teamid, (errors, results) => {
                if(errors){
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            })
        },
        joinTeam: function(teamName, accountId, callback){
            teamsRepository.joinTeam(teamName, accountId, (errors, results)=>{
                if(errors){
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            })
        },
        getTeam: function(id, callback){
            //error handling
            teamsRepository.getTeam(id, function(errors, results){
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