const { validTeamName } = require('./teams-validator');
const barlist = require('./models/pubcrawlFactory')
const { parsePubcrawl } = require('./pubcrawl-validator');
const { getPlaces } = require('../data-access-layer/service/fetch.data.service');
const {
    TEAM_NOT_FOUND,
    TEAM_NAME_TAKEN,
    AUTHORIZATION_FAIL
} = require('../business-logic-layer/models/error_enum')

module.exports = function({ teamsRepository, barsManager, accountRepository }){

    return {
        // No authorization needed. 
        // Any authenticated user can join team. 
        createTeam: function(team, account, callback){
            try {
                validTeamName(team.teamName);
            } catch (error) {
                callback(error, null);
                return;
            }

            accountRepository.getAccountById(
                account.id,
                (error, accountFromDb) => {
                    if(error) {
                        callback(AUTHORIZATION_FAIL, null);
                        return;
                    }
                    if(!account.username == accountFromDb.username 
                        && account.email == accountFromDb.email){
                            callback(AUTHORIZATION_FAIL, null);
                            return;
                        }
                }
            );

            teamsRepository.createTeam(team, async (error, newTeam) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        error.message = TEAM_NAME_TAKEN;
                    }
                    callback(error.message, null);
                } else {
                    await getPlaces();
                    const pubcrawl = barlist.getRandom();
                    barsManager.storePubcrawl(
                        pubcrawl,
                        account.id,
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
        delete: (accountId, teamId, callback) => {
            teamsRepository.getTeamById(teamId, (error, team) => {
                if (accountId == team?.creator_id) {
                    teamsRepository.deleteTeamById(teamId, (error, result) => {
                        if (error) callback(error, null);
                        else callback(null, null);
                    });
                } else {
                    teamsRepository.leaveTeam(accountId, (error, result) => {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, null);
                        }
                    })
                }
            });
        },
        // No authorization needed, anyone can join a team if they have the name.
        // Only owner can change team.
        joinTeam: (teamName, account, callback) => {
            accountRepository.getAccountById(account.id, (error, accountFromDb) => {
                if(error) {
                    callback(AUTHORIZATION_FAIL, null);
                    return;
                }
                if(!account.username == accountFromDb.username 
                    && account.email == accountFromDb.email){
                        callback(AUTHORIZATION_FAIL, null);
                        return;
                    }
            });
            teamsRepository.joinTeam(teamName, account.id, (error, results) => {
                if(error){
                    error = TEAM_NOT_FOUND
                    callback(error, null)
                }else{
                    callback(null, results)
                }
            })
        },
        getTeam: (id, callback) => {
            //error handling
            if (!id) {
                callback('No team', null);
                return;
            }
            teamsRepository.getTeam(id, (errors, team, pubcrawl, teamMembers) => {
                if (errors) {
                    console.log("Errors in teams-manager:", errors);
                    callback(errors, null);
                } else {
                    
                    try {
                        const parsed = parsePubcrawl(pubcrawl.data);
                        
                        const bars = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: bars,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    } catch (e) {
                        //Using sequilze the data is already parsed
                        const parsed = pubcrawl.data;
                        
                        const bars = {
                            parsed,
                            raw: pubcrawl,
                        }
                        const data = {
                            team: team,
                            pubcrawl: bars,
                            teamMembers: teamMembers
                        };
                        callback(null, data)
                    }
                    

                    
                }
            })
        },
        updateTeamPubcrawl: (team_id, account, pubcrawl_id, callback) => {
            // Featch pubcrawl and check if account.id is owner id
            barsManager.deletePubcrawlById(
                pubcrawl_id,
                account,
                async (error, result) => {
                    if (error) {
                        callback(error, null);
                    } else {
                        await getPlaces();
                        const pubcrawl = barlist.getRandom();
                        barsManager.storePubcrawl(
                            pubcrawl,
                            account.id,
                            (error, result) => {
                                if (error) {
                                    callback(error, null);
                                } else {
                                    // Update members
                                    console.log('Stored new pubcrawl');
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