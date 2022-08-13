const express = require('express')

module.exports = function({pubcrawlManager}){

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
        const pubcrawl = await pubcrawlManager.createPubcrawl();
        pubcrawlManager.storePubcrawl(
            pubcrawl,
            req.session.activeAccount.id,
            (error, result) => {
                if (error) {
                    console.log('Failed to save pubcrawl');
                    console.log(error);
                    res.render("start.hbs", { error })
                } else {
                    let pubcrawl_id = null
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
    
    router.get('/delete/:id', (req, res) => {
        const { id: pubcrawl_id } = req.params;
        const activeAccount = req.session.activeAccount;
        pubcrawlManager.deletePubcrawlById(pubcrawl_id , activeAccount, (error, result) => {
            if (error) console.log('Failed to delete pubcrawl: ', error);
            else {
                res.render("start.hbs", {activeAccount});
            }
        });
    });
    return router
}
