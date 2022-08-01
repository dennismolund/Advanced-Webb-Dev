const express = require('express');

const alreadySignedInCheck = (req, res, next) => {
    if (!req.session.activeAccount) next();
    else {
        res.redirect('/bars');
    }
}

module.exports = ({accountManager}) => {
    // Name all the dependencies in the curly brackets above.
    
    const router = express.Router();
    
    router.get("/login", alreadySignedInCheck, (request, response) => {
        response.render("login.hbs");
    })
    
    router.get("/signup", alreadySignedInCheck, (request, response) => {
        response.render("signup.hbs");
    })

    router.get("/start", (request, response) => {
        response.render("start.hbs");
    })
    
    router.post("/signup", alreadySignedInCheck, (request, response) => {
        
        const account = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
            confirmationPassword: request.body.confirmationPassword
        };
        accountManager.createAccount(account, (error, results) => {
            if(error){
                console.log("error:" , error);
                const errors = [];
                errors.push(error);
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
        accountManager.loginRequest(account, (error, account) => {
            if(error){
                console.log("errors ", error);
                const errors = [];
                errors.push(error);
                response.render("login.hbs", {errors});
            }else{
                console.log(account);
                request.session.activeAccount = account;
                
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

