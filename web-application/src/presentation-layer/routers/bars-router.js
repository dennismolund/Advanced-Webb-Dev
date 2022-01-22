const express = require('express')
const barlist = require('../../models/bar.model')

module.exports = function({barsManager}){

    const router = express.Router()

    router.get("/", (req, res)=>{

        const barRunda = barlist.getRandom()
        console.log("logbyname",barRunda);

        res.render("home.hbs", {bars: barRunda.list})
    })

    return router

}