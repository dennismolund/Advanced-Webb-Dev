const express = require('express')
var bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const { authenticateToken } = require('../middleware/authenticateToken')
const SECRET = "I Am Batman"

module.exports = function({accountManager}){

    const router = express.Router()


    router.post("/login", function(request, response){
    
        const grant_type = request.body.grant_type
        const account = {
            enteredUsername: request.body.username,
            enteredPassword: request.body.password,
        }

        if(grant_type != "password"){
            response.status(400).send({
                error: "unsupported_grant_type"
            })
        }
        
        accountManager.loginRequest(account, function(errors, results){
            if(errors){
                console.log("errors ", errors);
                
            }else{
                const idToken = {
                    sub: results.id,
                    preferred_username: results.username
                }
                const accessToken = jwt.sign(idToken, SECRET)

                response.status(200).send({
                    accessToken: accessToken,
                    token_type: "Bearer",
                    idToken
                });
            }
        })
    })

    return router
}