const express = require('express')
const session = require('express-session')
const barlist = require('../../models/bar.model')

module.exports = function({barsManager}){

    const router = express.Router()

    router.get("/", (req, res)=>{

        const barRunda = barlist.getRandom()
        try {
            const result = barsManager.storeBarRunda(barRunda, req.session.activeAccount)    
        } catch (error) {
            console.log("errors:", error.message);
        }
        

        res.render("home.hbs", {bars: barRunda.list})
    })

    return router

}