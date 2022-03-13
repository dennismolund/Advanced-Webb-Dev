const jwt = require("jsonwebtoken");
const SECRET = "I Am Batman";

const verifyAccessToken = (request, response, next) => {
    let authToken
    try {
        authToken = request.headers.authorization.split(' ')[1];
    } catch (e) {
        return next();
    }

    jwt.verify(authToken, SECRET, (err, verifiedToken) => {
        if (!err) request.isLoggedIn = true;
        next();
    });
}

module.exports = {
    verifyAccessToken,
}