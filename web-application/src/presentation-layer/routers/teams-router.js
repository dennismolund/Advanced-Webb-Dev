const { request } = require('express')
const express = require('express')
const session = require('express-session')

module.exports = ({teamsManager, accountManager}) => {

    const router = express.Router()

    router.post("/", (req, res) => {
        const team = {
            teamName: req.body.teamName,
            creatorId: req.session.activeAccount.id
        };
        teamsManager.createTeam(team, req.session.activeAccount, (error, result) => {
            if(error){
                console.log("errors ", error);
                res.render("barrundan.hbs", { error: error });
            }else{
                result.teamMembers = [];
                result.teamMembers.push(req.session.activeAccount.username);
                const model = {
                    team: true,
                    data: result,
                    activeAccount: req.session.activeAccount,
                }
                console.log("MODEL:", model);
                res.render("barrundan.hbs", model);
            }
        });
    });

    router.get("/", (req,res) => {
        teamsManager.getTeam(req.session.activeAccount.teamid, (error, result) => {
            if(error){
                console.log("ERROR TRIGGER IN TEAMS-ROUTER (GetTeam)", error);
                res.render("barrundan.hbs", error);
            }else{
                const model = {
                    team: true,
                    data: result,
                    activeAccount: req.session.activeAccount,
                }
                
                res.render("barrundan.hbs", model);
            }
        })
    })

    router.post("/delete/:id", (req,res) => {
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

