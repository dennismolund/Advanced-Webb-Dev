const hasTeamCheck = (req, res, next) => {
    if (req.account.team_id) {
        res.status(403).send({
            error: 'has_team_error',
            error_description: "Gå till http://localhost:3000 och lämna ditt team för ta bort / skapa barrunda.",
        });
        return;
    }
    next();
}

module.exports = {
    hasTeamCheck,
};
