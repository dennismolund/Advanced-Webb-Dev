const Sequelize = require('./connection-sq');
const Team = require('./models/Team')
const Account = require('./models/Account')
const Pubcrawl = require('./models/Pubcrawl');
const ERROR_ENUM = require('../error_enum');

module.exports = ({}) => {
    

    return{
        
        createTeam: async (team, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const newTeam = await Team.create({
                    name: team.teamName,
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
                await transaction.rollback();
                
                if (e.parent.code === 'ER_DUP_ENTRY') {
                    callback(ERROR_ENUM.TEAM_NAME_TAKEN, null);
                } else callback(ERROR_ENUM.SERVER_ERROR, null);
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
                    callback(TEAM_NOT_FOUND, null, null, null);
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
                await transaction.rollback();
                callback(e, null);
            }
        },
        leaveTeam: async (account_id, callback) => {
            try {
                const update = await Account.update(
                    { team_id: null, pubcrawl_id: null },
                    { where: { id: account_id } }
                );
                callback(null, null);
            } catch (e) {
                callback(error, null);
            }
        },
        joinTeam: async (teamName, account_id, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const [team] = await Team.findAll({ 
                    where: {
                        name: teamName
                    }
                });
                if (!team) callback(ERROR_ENUM.TEAM_NOT_FOUND, null); 
                const update = await Account.update(
                    { team_id: team.dataValues.id },
                    { where: { id: account_id }}
                );
                await transaction.commit();
                callback(null, team.dataValues.id);
            } catch (e) {
                await transaction.rollback();
                callback(ERROR_ENUM.SERVER_ERROR, null);
            }
        }
    }
}
