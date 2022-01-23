const express = require('express')
const session = require('express-session')
const barlist = require('../../models/bar.model')

module.exports = function({barsManager}){

    const router = express.Router()

    router.get("/", (req, res) => {
        getRunda(req, res, barsManager);
    });

    router.post('/', (req, res) => {
        storeBarRunda(req, res, barsManager);
    });

    return router
}

const getRunda = (req, res, manager) => {
    manager.getBarRunda(req.session.activeAccount, (error, result) => {
        if (error) {
            console.log(error);
            // TODO ?
        } else if (result){
            console.log('Found existing barrunda');
            res.render("home.hbs", {bars: result.list});
        } else {
            res.render("home.hbs", {bars: []});
            // There was no data found
        }
    });
}

const storeBarRunda = (req, res, manager) => {
    console.log('Creating and storing new barrunda');

    const barRunda = barlist.getRandom();

    manager.storeBarRunda(barRunda, req.session.activeAccount, (error, result) => {
        if (error) {
            console.log('Failed to save barrunda');
            console.log(error);
            // TODO ?
        } else {
            console.log('Succesfully stored new barrunda');
            // TODO ?
        }
    });
    res.render("home.hbs", {bars: barRunda.list})
}