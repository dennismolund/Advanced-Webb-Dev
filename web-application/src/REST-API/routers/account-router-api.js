const express = require('express')
var bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const SECRET = "I Am Batman";

module.exports = function({accountManager}){

    const router = express.Router()


    router.post("/login", function(request, response) {
    
        const grant_type = request.body.grant_type
        const account = {
            enteredUsername: request.body.username,
            enteredPassword: request.body.password,
        }

        if(grant_type != "password"){
            response.status(400).send({
                error: "unsupported_grant_type"
            });
        }
        if (request.isLoggedIn) return response.status(201).send();
        
        accountManager.loginRequest(account, function(errors, account){
            if(errors){
                console.log("errors ", errors);
                if (errors && errors[0] && errors[0] === "Fel lösenord eller användarnamn") {
                    response.status(401).json({ error: "unauthorized_client"});
                } else response.status(500).send('Internal server error');
            } else {
                const payload = {
                    username: account.username,
                    userid: account.userid
                }
                const accessToken = jwt.sign(payload, SECRET);

                response.status(200).send({
                    accessToken: accessToken,
                    token_type: "Bearer",
                    account: results,
                });
            }
        });
    });

    return router
}