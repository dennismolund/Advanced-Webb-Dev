//This code check if the user has a team. 
//The REST API does not support team CRUD operations as for grade 3 the REST API only needs to support CRUD operations on two resources: Account and pubcrawl.
//If the user have joined a team "outside" the REST API the user must leave/delete their team before they can use the functionality of the REST API. 
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
