const express = require('express')
const session = require('express-session')
const barlist = require('../../business-logic-layer/models/bar.model')
const { getPlaces } = require('../../data-access-layer/service/fetch.data.service');

module.exports = function({barsManager, teamsManager, accountManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        const account = req.session.activeAccount;
        barsManager.getPubcrawl(account, (error, result) => {
            if (error) {
                res.render("start.hbs", { activeAccount: account });
            } else if (result){
                var bars = result.parsed.list
                const barid = result.raw.id
                res.render("barrundasolo.hbs", {barid, bars, activeAccount: account});
            } else {
                console.log('**** ESLE');
                res.render("barrundasolo.hbs", {barid, bars: [], activeAccount: account});
                // There was no data found
            }
        });
    });

    router.post('/', async (req, res) => {
        console.log('Creating and storing new barrunda');
        await getPlaces();
        const barRunda = barlist.getRandom();
        let barid = null
        barsManager.storePubcrawl(barRunda, req.session.activeAccount.id, (error, result) => {
            if (error) {
                console.log('Failed to save barrunda');
                console.log(error);
                res.render("start.hbs", { error })
            } else {
                barid = result.insertId
                req.session.activeAccount.barrundaid = barid;
                res.render("barrundasolo.hbs", {barid,bars: barRunda.list, activeAccount: req.session.activeAccount})
            }
        });
    });
    
    router.get('/delete/:id', (req, res, next) => {
        const { id } = req.params;
        const user = req.session.activeAccount;
        barsManager.deleteBarrundaById(id, user, (error, result) => {
            if (error) console.log('Failed to delete barrunda: ', error);
            else {
                console.log('Succesfully deleted barrunda');
                res.render("start.hbs", {activeAccount: user});
            }
        });
    });
    return router
}
