const express = require('express')

module.exports = ({teamsManager}) => {

    const router = express.Router()

    router.post("/", (req, res) => {
        const team = {
            teamName: req.body.teamName,
            creatorId: req.session.activeAccount.id
        };
        teamsManager.createTeam(
            team,
            req.session.activeAccount,
            (error, result) => {
                if(error){
                    const errors = [];
                    errors.push(error);
                    res.render(
                        "start.hbs",
                        { errors , activeAccount: req.session.activeAccount }
                    );
                } else {
                    result.teamMembers = [];
                    result.teamMembers.push(req.session.activeAccount.username);
                    const model = {
                        team: true,
                        data: result,
                        activeAccount: req.session.activeAccount,
                        owner: null
                    }
                    if(model.data.team.creator_id == model.activeAccount.id) {
                        model.owner = true
                    }
                    req.session.activeAccount.team_id = result.team.id;
                    req.session.activeAccount.pubcrawl_id = result
                                                                .pubcrawl
                                                                .insertId;
                    res.render("barrundan.hbs", model);
                }
            }
        );
    });

    router.get("/", (req,res) => {
        const showteam = req.query.showteam === "true" ? true : false
        teamsManager.getTeam(
            req.session.activeAccount,
            (error, team) => {
                if (error) {
                    res.render(
                        "start.hbs",
                        { activeAccount: req.session.activeAccount }
                    );
                } else {
                    const model = {
                        team: showteam,
                        data: team,
                        activeAccount: req.session.activeAccount,
                        owner: null
                    }

                    if(model.data.team.creator_id == model.activeAccount.id) {
                        model.owner = true
                    }
                    res.render("barrundan.hbs", model);
                }
            }
        );
    });

    router.post("/delete/:id", (req,res) => {
        teamsManager.delete(
            req.session.activeAccount.id,
            req.params.id,
            (error, results) => {
            if (error) {
                res.redirect("/");
            } else {
                res.render(
                    "start.hbs",
                    { activeAccount: req.session.activeAccount }
                );
            }
        });

    });

    router.post("/join", (req,res) => {
        const teamName = req.body.teamName;
        teamsManager.joinTeam(
            teamName,
            req.session.activeAccount,
            (error, result) => {
                if (error) {
                    const errors = [];
                    errors.push(error);
                    res.render(
                        "start.hbs",
                        { errors , activeAccount: req.session.activeAccount}
                    );
                } else {
                    req.session.activeAccount.team_id = result;
                    res.redirect("/teams");
                }
            }
        );
    });

    router.post("/:id/update", (req, res) => {
        const { id: team_id } = req.params;
        const { activeAccount: account } = req.session;
        const { pubcrawl_id } = account;
        teamsManager.updateTeamPubcrawl(
            team_id,
            account,
            pubcrawl_id,
            (error, result) => {
                if (error) {
                    res.redirect('/teams')
                } else {
                    req.session.activeAccount.pubcrawl_id = result.id;
                    res.redirect('/teams');
                }
        });

    });
    return router
}

