const express = require('express')
var bcrypt = require('bcrypt');
const ERROR_ENUM = require('../../../business-logic-layer/models/error_enum');
const { authenticateToken } = require('../middleware/authenticateToken');
const { jwt_secret, supportedClients } = require('../const');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const SECRET = jwt_secret;

module.exports = function({accountManager}){

    const router = express.Router()

    router.get('/test', (req, res) => {
        res.status(200).json('hello');
    });

    router.post("/login-sessions", function(request, response) {
    
        const {
            grant_type,
            username: enteredUsername,
            password: enteredPassword,
            client_id
        } = request.body;

        const loginAccount = {
            enteredUsername,
            enteredPassword,
        };

        if (grant_type != "password") {
            response.status(400).send({
                error: "unsupported_grant_type",
                error_description: "Grant type is not supported"
            });
            return;
        }

        if (!enteredUsername || !enteredPassword || !client_id) {
            response.status(400).send({
                error: "invalid_request",
                error_description: "Missing parameter in request"
            });
            return;
        }
        
        if (!supportedClients.includes(client_id)) {
            console.log(supportedClients);
            console.log(client_id);
            response.status(400).send({
                error: "invalid_client",
                error_description: "The client is not registered"
            });
            return;
        }
        
        accountManager
            .getAccountByUsername(
                loginAccount,
                (error, account) => {
                    if(error){
                        console.log("errors ", error);
                        if (error === ERROR_ENUM.SERVER_ERROR) {
                            response
                                .status(500)
                                .json({ error: ERROR_ENUM.SERVER_ERROR });
                        } else {
                            response
                                .status(400)
                                .json({
                                    error: "invalid_grant",
                                    error_description: error
                                });
                        }
                    } else {
                        const payload = {
                            id: account.id,
                            username: account.username,
                            pubcrawl_id: account.pubcrawl_id,
                            team_id: account.team_id
                        };
                        const idToken = {
                            sub: account.id,
                            user: payload,
                            iss: "api.barrundan.se",
                            iat: Date.now(),
                            exp: Date.now() + 1000 * 60 * 60,
                        }
                        const access_token = jwt.sign(idToken, SECRET);

                        response.status(200).send({
                            access_token,
                            token_type: "Bearer",
                        });
                    }
                }
            );
    });

    router.post('', (req, res) => {
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