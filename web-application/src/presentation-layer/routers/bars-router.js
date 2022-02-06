const express = require('express')
const session = require('express-session')
const barlist = require('../../models/bar.model')

module.exports = function({barsManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        barsManager.getBarRunda(req.session.activeAccount, (error, result) => {
            if (error) {
                console.log(error);
                // TODO ?
            } else if (result){
                console.log('Found existing barrunda');

                res.render("home.hbs", {bars: result.list, activeAccount: req.session.activeAccount});
            } else {
                res.render("home.hbs", {bars: [], activeAccount: req.session.activeAccount});
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
                // TODO ?
            }
        });
        res.render("home.hbs", {bars: barRunda.list, activeAccount: req.session.activeAccount})
    });
    
    return router
}
