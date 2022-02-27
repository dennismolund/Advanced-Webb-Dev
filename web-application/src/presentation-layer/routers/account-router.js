const express = require('express');

const alreadySignedInCheck = (req, res, next) => {
    if (!req.session.activeAccount) next();
    else {
        res.redirect('/logout');
    }
}

module.exports = function({accountManager}){
    // Name all the dependencies in the curly brackets above.
    
    const router = express.Router();
    
    router.get("/login", alreadySignedInCheck, (request, response) => {
        response.render("login.hbs");
    })
    
    router.get("/signup", alreadySignedInCheck, (request, response) => {
        response.render("signup.hbs");
    })
    
    router.post("/signup", alreadySignedInCheck, (request, response) => {
        
        const account = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
            confirmationPassword: request.body.confirmationPassword
        };
        accountManager.createAccount(account, (errors, results) => {
            if(errors){
                console.log("errors:" , errors);
                response.render("signup.hbs", {errors});
            }else{
                response.render("login.hbs");
            }
        });
    })
    
    router.post("/login", alreadySignedInCheck, (request, response) => {
        const account = {
            enteredUsername: request.body.username,
            enteredPassword: request.body.password,
        };
        accountManager.loginRequest(account, (errors, results) => {
            if(errors){
                console.log("errors ", errors);
                response.render("login.hbs", {errors});
            }else{
                request.session.activeAccount = results;
                console.log("active: ", request.session.activeAccount);
                response.redirect("/");
            }
        });
    });
    
    router.get("/logout", (request, response) => {
        console.log("Destroying session");
        request.session.destroy((error) => {
            console.log(error);
        });
        response.redirect("/");
    });
    
    return router;
    
}

