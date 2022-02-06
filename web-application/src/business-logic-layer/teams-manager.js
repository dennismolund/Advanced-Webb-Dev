const express = require('express')


module.exports = function({teamsRepository}){

    return {
        createTeam: function(team, callback){
            //error handling

            console.log("Inside team-manager, team:", team);
            teamsRepository.createTeam(team, function(errors, results){
                if(errors){
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null)
                }else{
                    callback(null, results)
                }
            })
        },
        getTeam: function(user, callback){
            //error handling

            teamsRepository.getTeam(user, function(errors, results){
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