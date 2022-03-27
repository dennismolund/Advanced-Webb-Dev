const isSignedIn = (req, res, next) => {
	if (req.session && req.session.activeAccount) next();
	else res.redirect('anvandare/login');
}

module.exports = {
    isSignedIn,
};