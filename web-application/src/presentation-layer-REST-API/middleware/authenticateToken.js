const jwt = require("jsonwebtoken");
const SECRET = "I Am Batman";

const verifyAccessToken = (request, response, next) => {
    let token
    try {
        token = request.headers.authorization.split(' ')[1];
    } catch (e) {
        response.status(400).send({
            error: 'invalid_grant',
            error_description: 'Missing token'
        });
        return;
    }

    jwt.verify(token, SECRET, (err, verifiedToken) => {
        if (err) {
            response.status(400).send({
                error: 'invalid_grant',
                error_description: 'Invalid token'
            });
            console.log('Could not verify token');
            return;
        }
        request.account = verifiedToken.user;
        if (!err) request.isLoggedIn = true;
        next();
    });
}

module.exports = {
    verifyAccessToken,
}