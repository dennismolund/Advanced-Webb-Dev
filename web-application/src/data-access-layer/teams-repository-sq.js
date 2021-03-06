const Sequelize = require('./connection-sq');
const Team = require('../business-logic-layer/models/Team')
const Account = require('../business-logic-layer/models/Account')
const Pubcrawl = require('../business-logic-layer/models/Pubcrawl');
const ERROR_ENUM = require('../business-logic-layer/models/error_enum');


const errHandler = (err) =>{
    console.error("Error: ", err);
    
}

module.exports = ({}) => {
    

    return{
        
        createTeam: async (team, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newTeam = await Team.create({
                    teamname: team.teamName,
                    creator_id: team.creatorId
                });
                const updateteam_ids = await Account.update(
                    { team_id: newTeam?.dataValues.id },
                    { where: { id: team.creatorId } }
                );
                await transaction.commit();
                const result = newTeam.dataValues;
                result.insertId = result.id;
                callback(null, result);
            } catch (e) {
                console.log('Error creating new team: ', e.parent);
                await transaction.rollback();
                const err = {
                    code: e.parent.code,
                    message: ERROR_ENUM.SERVER_ERROR
                };
                callback(err, null);
            }
        },
        getTeamById: async (id, callback) => {
            try {
                const team = await Team.findOne({
                    where: { id }
                });
                callback(null, team?.dataValues);
            } catch (e) {
                console.log('error getting team', e);
                callback(e, null);
            }
        },
        getTeam: async (id, callback) => {
            const transaction = await Sequelize.transaction();
            try {

                const [team] = await Team.findAll({ 
                    where: { 
                        id
                    }
                });
                if (!team) {
                    callback('No team found', null, null, null);
                    return;
                } 
                const [pubcrawl] = await Pubcrawl.findAll({ 
                    where: { 
                        owner_id: team.dataValues.creator_id
                    }
                });
                const teamMembers = await Account.findAll({ 
                    where: { 
                        team_id: id
                    }
                });

                const usernameList = teamMembers.map((member) =>
                                                        member
                                                        .dataValues
                                                        .username
                                                    );

                await transaction.commit();
                callback(
                    null,
                    team.dataValues,
                    pubcrawl.dataValues,
                    usernameList
                );
            } catch (e) {
                console.log('Error getting team: ', e);
                await transaction.rollback();
                callback(['databaseError']);
            }
        },
        deleteTeamById: async (team_id, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const deleteRes = await Team.destroy({ 
                    where: { 
                        id: team_id
                    }
                });
                // { team_id: team_id } === { team_id } 
                const updateRes = await Account.update(
                    { team_id: null, pubcrawl_id: null },
                    { where: { team_id } }
                );
                await transaction.commit();
                callback(null, null)
            } catch (e) {
                console.log('Error deleting team: ', e);
                await transaction.rollback();
                callback(e, null);
            }
        },
        leaveTeam: async (accountId, callback) => {
            try {
                const update = await Account.update(
                    { team_id: null, pubcrawl_id: null },
                    { where: { id: accountId } }
                );
                callback(null, null);
            } catch (e) {
                console.log('Error leaving team:', e);
                callback(error, null);
            }
        },
        joinTeam: async (teamName, accountId, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const [team] = await Team.findAll({ 
                    where: {
                        teamname: teamName
                    }
                });
                if (!team) callback('No team found', null); 
                const update = await Account.update(
                    { team_id: team.dataValues.id },
                    { where: { id: accountId }}
                );
                await transaction.commit();
                callback(null, team.dataValues.id);
            } catch (e) {
                console.log('Error joining team: ', e);
                await transaction.rollback();
                callback(e, null);
            }
        }
    }
}
