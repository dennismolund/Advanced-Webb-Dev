const express = require('express')
const session = require('express-session')
const barlist = require('../../models/bar.model')

module.exports = function({barsManager, teamsManager, accountManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        const account = req.session.activeAccount
        /*
            Look for barrunda
            Look for active team
            
        */

        barsManager.getBarRunda(account, (error, result) => {
            if (error) {
                console.log(error);
                // TODO ?
            } else if (result){
                var bars = result.parsed.list
                const barid = result.raw.id
                teamsManager.getTeam(account.id, (error, result) =>{
                    const team = result
                    if(error){
                        res.render("barrundasolo.hbs", {barid, bars, activeAccount: account});
                    }else{
                        
                        res.render("barrundasolo.hbs", {barid, bars, team, activeAccount: account});
                    }
                });
                
            } else {
                
                res.render("barrundasolo.hbs", {barid, bars: [], activeAccount: account});
                // There was no data found
            }
        });
    });

    router.post('/', (req, res) => {
        console.log('Creating and storing new barrunda');
        const barRunda = barlist.getRandom();
        let barid = null
        barsManager.storeBarRunda(barRunda, req.session.activeAccount, (error, result) => {
            if (error) {
                console.log('Failed to save barrunda');
                console.log(error);
                res.render("start.hbs", {error})
                // TODO ?
            } else {
                barid = result.insertId
                console.log('WE SHOULD SET SESSION BARRUNDA HERE', barid);
                res.render("barrundasolo.hbs", {barid,bars: barRunda.list, activeAccount: req.session.activeAccount})
            }
        });
    });

    // router.post('/delete', (req, res) => {
    //     const account = req.session.activeAccount
    //     res.render("start.hbs", {activeAccount: account});
    // })
    
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
