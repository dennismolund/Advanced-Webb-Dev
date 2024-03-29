const { validTeamName } = require('./teams-validator');
const publist = require('./models/pubcrawlFactory')
const { parsePubcrawl } = require('./pubcrawl-validator');
const { getPubsFromGoogleAPI } = require('./service/fetch.data.service');
const ERROR_ENUM = require('../business-logic-layer/models/error_enum');

module.exports = function({ teamsRepository, pubcrawlManager, accountRepository }){
    return {
        createTeam: function(team, activeAccount, callback){
            if(!activeAccount) {
                callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                return;
            }
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
                return;
            }

            accountRepository.getAccountById(
                activeAccount.id,
                (error, accountFromDb) => {
                    if(error) {
                        callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                        return;
                    }
                    if(!activeAccount.username == accountFromDb.username 
                        && activeAccount.email == accountFromDb.email){
                            callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                            return;
                        }
                }
            );

            teamsRepository.createTeam(team, async (error, newTeam) => {
                if (error) {
                    callback(error, null);
                } else {
                    await getPubsFromGoogleAPI();
                    const pubcrawl = publist.getRandom();
                    pubcrawlManager.storePubcrawl(
                        pubcrawl,
                        activeAccount.id,
                        (error, result) => {
                            if (error) {
                                callback(error, null);
                            } else {
                                const data = {
                                    team: newTeam,
                                    pubcrawl: result,
                                };
                                callback(null, data);
                            }
                        }
                    );
                }
            })
        },

        delete: (account_id, team_id, callback) => {
            teamsRepository.getTeamById(team_id, (error, team) => {
                if (account_id == team?.creator_id) {
                    teamsRepository.deleteTeamById(team_id, (error, result) => {
                        if (error) callback(error, null);
                        else callback(null, null);
                    });
                } else {
                    teamsRepository.leaveTeam(account_id, (error, result) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, null);
                        }
                    })
                }
            });
        },

        joinTeam: (teamName, activeAccount, callback) => {
            //Check if an account is logged in.
            if(!activeAccount) {
                callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                return;
            }
            accountRepository.getAccountById(activeAccount.id, (error, accountFromDb) => {
                if(error) {
                    callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                    return;
                }
                if(!activeAccount.username == accountFromDb.username 
                    && activeAccount.email == accountFromDb.email){
                        callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                        return;
                    }
            });
            teamsRepository.joinTeam(teamName, activeAccount.id, (error, results) => {
                if(error) {
                    callback(error, null)
                }else {
                    callback(null, results)
                }
            })
        },
        
        getTeam: (activeAccount, callback) => {
            if(!activeAccount) {
                callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                return;
            }
            else if (!activeAccount.team_id) {
                callback(ERROR_ENUM.NO_TEAM_FOR_ACCOUNT, null);
                return;
            }

            teamsRepository.getTeam(activeAccount.team_id, (errors, team, pubcrawl, teamMembers) => {
                if (errors) {

                    callback(errors, null);
                } else {
                    if(team.id !== activeAccount.team_id){
                        callback(ERROR_ENUM.AUTHORIZATION_FAIL, null);
                        return;
                    }
                    try {
                        const parsed = parsePubcrawl(pubcrawl.pub_list);
                        const pubs = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: pubs,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    } catch (e) {
                        //Using sequilze the data is already parsed
                        const parsed = pubcrawl.pub_list;
                        const pubs = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: pubs,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    }
                }
            })
        },
        
        updateTeamPubcrawl: (team_id, activeAccount, pubcrawl_id, callback) => {
            // Featch pubcrawl and check if account.id is owner id
            pubcrawlManager.deletePubcrawlById(
                pubcrawl_id,
                activeAccount,
                async (error, result) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        await getPubsFromGoogleAPI();
                        const pubcrawl = publist.getRandom();
                        pubcrawlManager.storePubcrawl(
                            pubcrawl,
                            activeAccount.id,
                            (error, result) => {
                                if (error) {
                                    callback(error, null);
                                } else {
                                    // Update members
                                    const data = {
                                        id: result.insertId
                                    };

                                    teamsRepository
                                    .updatePubcrawlForMembers(
                                        team_id,
                                        result.insertId,
                                        (error, result) => {
                                            if (error) callback(error, null);
                                            else callback(null, data);
                                        }
                                    );
                                }
                            }
                        );
                    };
                }
            );
        },
    }
}