const { request } = require('express')
const express = require('express')
const session = require('express-session')

module.exports = ({teamsManager}) => {

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
                    owner: null
                }
                if(model.data.team.creatorid == model.activeAccount.id) model.owner = true
                
                res.render("barrundan.hbs", model);
            }
        });
    });

    router.get("/", (req,res) => {
        console.log("req.query.showteam:", req.query);
        const showteam = req.query.showteam === "true" ? true : false
        console.log("showteam:", showteam);
        teamsManager.getTeam(req.session.activeAccount.teamid, (error, result) => {
            if(error){
                console.log("ERROR TRIGGER IN TEAMS-ROUTER (GetTeam)", error);
                res.render("barrundan.hbs", error);
            }else{
                const model = {
                    team: showteam,
                    data: result,
                    activeAccount: req.session.activeAccount,
                    owner: null
                }

                if(model.data.team.creatorid == model.activeAccount.id) model.owner = true
                res.render("barrundan.hbs", model);
            }
        })
    })

    router.post("/delete/:id", (req,res) => {
        const team = {
            teamid: req.params.id,
            userid: req.session.activeAccount.id,
            teamowner: req.body.teamcreatorid
        }
        console.log("TEAM IN ROUTER WHEN DELETE:", team);
        teamsManager.delete(team, (error, results) => {
            if(error){
                res.redirect("/", error)
            }else res.render("start.hbs", {activeAccount: req.session.activeAccount})
        })

    })

    router.post("/join", (req,res)=>{
        const teamName = req.body.teamName
        const accountId = req.session.activeAccount.id
        teamsManager.joinTeam(teamName, accountId, (error, result)=>{
            if(error){
                console.log("error:" , error);
                res.redirect("/", error)
            }else {
                console.log("result:" , result);
                req.session.activeAccount.teamid = result
                res.redirect("/teams")
            }
        })
    })
    return router
}

