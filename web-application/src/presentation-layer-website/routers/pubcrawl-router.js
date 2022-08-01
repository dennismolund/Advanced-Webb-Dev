const express = require('express')
const Pubcrawl = require('../../business-logic-layer/models/pubcrawlFactory')
const {
    getPubsFromGoogleAPI
} = require('../../data-access-layer/service/fetch.data.service');

module.exports = function({pubcrawlManager, teamsManager, accountManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        const account = req.session.activeAccount;
        pubcrawlManager.getPubcrawl(account, (error, pubcrawl) => {
            if (error) {
                res.render("start.hbs", { activeAccount: account });
            } else if (pubcrawl){
                const pubs = pubcrawl.parsed.list;
                const pubcrawlId = pubcrawl.raw.id;
                res.render(
                    "barrundasolo.hbs",
                    { pubcrawlId, pubs, activeAccount: account }
                );
            } else {
                res.render(
                    "barrundasolo.hbs",
                    { pubcrawlId, pubs: [], activeAccount: account }
                );
            }
        });
    });

    router.post('/', async (req, res) => {
        await getPubsFromGoogleAPI();
        const pubcrawl = Pubcrawl.getRandom();
        let pubcrawlId = null
        pubcrawlManager.storePubcrawl(
            pubcrawl,
            req.session.activeAccount.id,
            (error, result) => {
                if (error) {
                    console.log('Failed to save pubcrawl');
                    console.log(error);
                    res.render("start.hbs", { error })
                } else {
                    pubcrawlId = result.insertId
                    req.session.activeAccount.pubcrawl_id = pubcrawlId;
                    res.render(
                        "barrundasolo.hbs",
                        {
                            pubcrawlId,
                            pubs: pubcrawl.list,
                            activeAccount: req.session.activeAccount
                        }
                    );
                }
            }
        );
    });
    
    router.get('/delete/:id', (req, res, next) => {
        const { id } = req.params;
        const account = req.session.activeAccount;
        pubcrawlManager.deletePubcrawlById(id, account, (error, result) => {
            if (error) console.log('Failed to delete pubcrawl: ', error);
            else {
                console.log('Succesfully deleted pubcrawl');
                res.render("start.hbs", {activeAccount: account});
            }
        });
    });
    return router
}
