const express = require('express')
const Pubcrawl = require('../../business-logic-layer/models/pubcrawlFactory')
const {
    getPubsFromGoogleAPI
} = require('../../business-logic-layer/service/fetch.data.service');

module.exports = function({pubcrawlManager, teamsManager, accountManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        const account = req.session.activeAccount;
        pubcrawlManager.getPubcrawl(account, (error, pubcrawl) => {
            if (error) {
                res.render("start.hbs", { activeAccount: account });
            } else if (pubcrawl){
                const pubs = pubcrawl.parsed.list;
                const pubcrawl_id = pubcrawl.raw.id;
                res.render(
                    "barrundasolo.hbs",
                    { pubcrawl_id, pubs, activeAccount: account }
                );
            } else {
                res.render(
                    "barrundasolo.hbs",
                    { pubcrawl_id, pubs: [], activeAccount: account }
                );
            }
        });
    });

    router.post('/', async (req, res) => {
        await getPubsFromGoogleAPI();
        const pubcrawl = Pubcrawl.getRandom();
        let pubcrawl_id = null
        pubcrawlManager.storePubcrawl(
            pubcrawl,
            req.session.activeAccount.id,
            (error, result) => {
                if (error) {
                    console.log('Failed to save pubcrawl');
                    console.log(error);
                    res.render("start.hbs", { error })
                } else {
                    pubcrawl_id = result.insertId
                    req.session.activeAccount.pubcrawl_id = pubcrawl_id;
                    res.render(
                        "barrundasolo.hbs",
                        {
                            pubcrawl_id,
                            pubs: pubcrawl.list,
                            activeAccount: req.session.activeAccount
                        }
                    );
                }
            }
        );
    });
    
    router.get('/delete/:id', (req, res, next) => {
        const { id: pubcrawl_id } = req.params;
        const activeAccount = req.session.activeAccount;
        pubcrawlManager.deletePubcrawlById(pubcrawl_id , activeAccount, (error, result) => {
            if (error) console.log('Failed to delete pubcrawl: ', error);
            else {
                console.log('Succesfully deleted pubcrawl');
                res.render("start.hbs", {activeAccount});
            }
        });
    });
    return router
}
