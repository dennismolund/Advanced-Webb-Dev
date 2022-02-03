const { request } = require('express')
const express = require('express')
const session = require('express-session')

module.exports = function({teamsManager, accountManager}){

    const router = express.Router()

    router.post("/", function(request, response){
        const team = {
            teamName: request.body.teamName,
            creator: request.session.activeAccount.username
        }

        console.log("In router, team:", team);

        accountManager.getAccountIdByUsername(team.creator, function(errors, results){
            if(errors){
                console.log("errors ", errors);
                response.render("home.hbs", {errors})
            }else{
                team.creatorId = results
                console.log("In router, after retrieve ID team:", team);
                teamsManager.createTeam(team, function(errors, results){
                    if(errors){
                        console.log("errors ", errors);
                        response.redirect("/")
                    }else{
                        response.redirect("/")
                    }
                })
            }
        })

        
    })

    return router
}