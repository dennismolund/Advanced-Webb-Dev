const express = require('express')
var bcrypt = require('bcryptjs');
const ERROR_ENUM = require('../../models/error.enum');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const SECRET = "I Am Batman";

module.exports = function({accountManager}){

    const router = express.Router()

    router.get('/test', (req, res) => {
        res.status(200).json('hello');
    });

    router.post("/login", function(request, response) {
    
        const grant_type = request.body.grant_type
        const loginAccount = {
            enteredUsername: request.body.username,
            enteredPassword: request.body.password,
        }

        if(grant_type !== 'access_token' && grant_type !== 'password'){
            response.status(400).send({
                error: "unsupported_grant_type"
            });
            return;
        }

        // If request was sent with valid auth header, we just return the account.
        if (request.isLoggedIn) {
            const token = request.headers['authorization'].split(' ')[1];
            const decoded = jwt.decode(token)
            response.status(200).json({
                account: decoded,
            });
            return;
        }

        if (grant_type != "password") {
            response.status(400).send({
                error: "unsupported_grant_type"
            });
            return;
        }
        
        
        accountManager.loginRequest(loginAccount, function(error, account){
            if(error){
                console.log("errors ", error);
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    response.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                } else {
                    response.status(401).json({ error: error });
                }
            } else {
                const payload = {
                    preferred_username: account.username,
                    account,
                }
                const accessToken = jwt.sign(payload, SECRET);

                response.status(200).send({
                    accessToken: accessToken,
                    token_type: "Bearer",
                    account,
                });
            }
        });
    });

    router.post('/signup', (req, res) => {
        const newAccount = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmationPassword: req.body.confirmPassword,
        }
        accountManager.createAccount(newAccount, (error, results) => {
            if (error === ERROR_ENUM.SERVER_ERROR) {
                res.status(500).json({ error: error });
            } else if (error) {
                res.status(400).json({ error: error });
            }
            else {
                res.status(204).send();
            }
        });
    });

    return router
}