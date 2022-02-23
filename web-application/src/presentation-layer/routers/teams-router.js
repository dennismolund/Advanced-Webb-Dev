const { request } = require('express')
const express = require('express')
const session = require('express-session')

module.exports = function({teamsManager, accountManager}){

    const router = express.Router()

    router.post("/", (req, res)=>{
        const team = {
            teamName: req.body.teamName,
            creator: req.session.activeAccount.username
        }

        console.log("In router, team:", team);

        accountManager.getAccountIdByUsername(team.creator, function(errors, results){
            if(errors){
                console.log("errors ", errors);
                res.render("home.hbs", {errors})
            }else{
                team.creatorId = results
                console.log("In router, after retrieve ID team:", team);
                teamsManager.createTeam(team, function(errors, results){
                    if(errors){
                        console.log("errors ", errors);
                        res.redirect("/")
                    }else{
                        res.redirect("/")
                    }
                })
            }
        })
    })

    router.get("/", (req,res)=>{
        accountManager.getAccountIdByUsername(team.creator, function(errors, results){
            if(errors){
                console.log("errors ", errors);
                res.render("home.hbs", {errors})
            }else{
                const creatorId = results
                console.log("In router, after retrieve ID team:", team);
                teamsManager.getTeam(creatorId, function(errors, results){
                    if(errors){
                        console.log("errors ", errors);
                        res.redirect("/")
                    }else{
                        console.log("Get team:", results);
                        res.redirect("/")
                    }
                })
            }
        })
    })

    router.post("/delete/:id", (req,res)=>{
        const teamid = req.params.id
        teamsManager.delete(teamid, (error, results)=>{
            if(error){
                res.redirect("/", error)
            }else res.redirect("/")
        })

    })

    router.post("/join", (req,res)=>{
        const teamName = req.body.teamName
        const accountId = req.session.activeAccount.id
        teamsManager.joinTeam(teamName, accountId, (error, results)=>{

        })
    })
    return router
}