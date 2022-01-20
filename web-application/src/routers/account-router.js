const express = require('express')

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})


router.get("/signup", function(request, response){
    response.render("signup.hbs")
})


module.exports = router