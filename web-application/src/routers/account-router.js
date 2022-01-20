const express = require('express')
const accountManager = require('../business-logic-layer/account-manager')

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})


router.get("/signup", function(request, response){
    response.render("signup.hbs")
})

router.post("/signup", function(request, response){
	
	const account = {
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        confirmationPassword: request.body.confirmationPassword
    }  

    accountManager.createAccount(account, function(errors, results){
        if(errors > 0){
            console.log("errors:" , errors)
            response.render("signup.hbs", {errors})
        }else{
            //console.log("createAccount:", accountID)
            response.render("login.hbs")

        }
    })
	
})

module.exports = router
