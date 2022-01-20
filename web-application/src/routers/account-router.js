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
        if(errors){
            console.log("errors:" , errors)
            response.render("signup.hbs", {errors})
        }else{
            //console.log("createAccount:", accountID)
            response.render("login.hbs")

        }
    })
	
})

router.post("/login", function(request, response){
    const account = {
        enteredUsername: request.body.username,
        enteredPassword: request.body.password,
    }

    
    accountManager.loginRequest(account, function(errors, results){
        if(errors){
            console.log("errors ", errors);
            response.render("login.hbs", {errors})
        }else{
            console.log("successfull login with account:", results);
            response.render("login.hbs")
        }
    })
    
   
})

module.exports = router
