const jwt = require("jsonwebtoken");
const SECRET = "I Am Batman"

exports.authenticateToken = function (request, response, next) {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.status(401).send({
        error: "invalid_client"
    }) //check if token exists

    jwt.verify(token, SECRET, function(error, idToken){
        if(error) return response.status(403).send({
            error: "unauthorized_client"
        })
        console.log("account:", idToken);
        request.idToken = idToken
        next()
    })
}