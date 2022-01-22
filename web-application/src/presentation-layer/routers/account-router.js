const express = require('express')


module.exports = function({accountManager}){
    // Name all the dependencies in the curly brackets above.
    
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
                request.session.activeAccount = results
                console.log("active: ", request.session.activeAccount);
                response.redirect("/")
            }
        })
    })
    
    router.get("/logout", function(request, response){
        console.log("Destroying session")
        request.session.destroy(function(error){
            console.log(error)
        })
        response.redirect("/")
    })
    
    return router
    
  }

