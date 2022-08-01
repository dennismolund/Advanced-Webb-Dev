const express = require('express')
const Pubcrawl = require('../../business-logic-layer/models/pubcrawlFactory')
const {
    getPlaces
} = require('../../data-access-layer/service/fetch.data.service');

module.exports = function({pubcrawlManager, teamsManager, accountManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        const account = req.session.activeAccount;
        pubcrawlManager.getPubcrawl(account, (error, pubcrawl) => {
            if (error) {
                res.render("start.hbs", { activeAccount: account });
            } else if (pubcrawl){
                const bars = pubcrawl.parsed.list;
                const barid = pubcrawl.raw.id;
                res.render(
                    "barrundasolo.hbs",
                    { barid, bars, activeAccount: account }
                );
            } else {
                res.render(
                    "barrundasolo.hbs",
                    { barid, bars: [], activeAccount: account }
                );
            }
        });
    });

    router.post('/', async (req, res) => {
        await getPlaces();
        const pubcrawl = Pubcrawl.getRandom();
        let barid = null
        pubcrawlManager.storePubcrawl(
            pubcrawl,
            req.session.activeAccount.id,
            (error, result) => {
                if (error) {
                    console.log('Failed to save pubcrawl');
                    console.log(error);
                    res.render("start.hbs", { error })
                } else {
                    barid = result.insertId
                    req.session.activeAccount.pubcrawl_id = barid;
                    res.render(
                        "barrundasolo.hbs",
                        {
                            barid,
                            bars: pubcrawl.list,
                            activeAccount: req.session.activeAccount
                        }
                    );
                }
            }
        );
    });
    
    router.get('/delete/:id', (req, res, next) => {
        const { id } = req.params;
        const user = req.session.activeAccount;
        pubcrawlManager.deletePubcrawlById(id, user, (error, result) => {
            if (error) console.log('Failed to delete pubcrawl: ', error);
            else {
                console.log('Succesfully deleted pubcrawl');
                res.render("start.hbs", {activeAccount: user});
            }
        });
    });
    return router
}
