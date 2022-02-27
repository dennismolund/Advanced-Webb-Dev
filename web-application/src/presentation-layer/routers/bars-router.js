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
                var bars = result.list
                console.log('Found existing barrunda');
                teamsManager.getTeam(account.id, (error, result) =>{
                    const team = result
                    console.log("team:", team);
                    if(error){
                        res.render("home.hbs", {bars, activeAccount: account});
                    }else{
                        res.render("home.hbs", {bars, team, activeAccount: account});
                    }
                });
                
            } else {
                res.render("home.hbs", {bars: [], activeAccount: account});
                // There was no data found
            }
        });

        
    });

    router.post('/', (req, res) => {
        console.log('Creating and storing new barrunda');
        const barRunda = barlist.getRandom();

        barsManager.storeBarRunda(barRunda, req.session.activeAccount, (error, result) => {
            if (error) {
                console.log('Failed to save barrunda');
                console.log(error);
                // TODO ?
            } else {
                console.log('Succesfully stored new barrunda');
                console.log("result",result);
                // TODO ?
                teamsManager.updateTeamBarrunda(req.session.activeAccount, result, (error,result) => {
                    if(error){
                        console.log("failed to update team barrunda");
                    }else{
                        console.log("succesfully updated team barrunda");
                    }
                })
            }
        });
        res.render("home.hbs", {bars: barRunda.list, activeAccount: req.session.activeAccount})
    });
    
    router.delete('/:id', (req, res, next) => {
        const { id } = req.params;
        const user = req.session.activeAccount;

        barsManager.deleteBarrundaById(id, user, (error, result) => {
            if (error) console.log('Failed to delete barrunda: ', error);
            else console.log('Succesfully deleted barrunda');
        });
    });
    return router
}
