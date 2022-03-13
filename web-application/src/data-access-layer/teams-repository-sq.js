const Sequelize = require('./connection-sq');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');


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
                    creatorid: team.creatorId
                });
                const updateTeamids = await Account.update(
                    { teamid: newTeam?.dataValues.id },
                    { where: { id: team.creatorId } }
                );
                await transaction.commit();
                const result = newTeam.dataValues;
                result.insertId = result.id;
                callback(null, result);
            } catch (e) {
                console.log('Error creating new team: ', e);
                await transaction.rollback();
                callback('Internal server error', null);
            }
        },

        getTeam: async (id, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                // [team] => Array destruction => [team] === Team.findAll()[0]
                const [team] = await Team.findAll({ where: { id }});
                if (!team) {
                    callback('No team found', null, null, null);
                    return;
                } 
                const [barrunda] = await Barrunda.findAll({ where: { owner: team.dataValues.creatorid } });
                const teamMembers = await Account.findAll({ where: { teamid: id } });

                const usernameList = teamMembers.map((member) => member.dataValues.username);

                await transaction.commit();
                callback(null, team.dataValues, barrunda.dataValues, usernameList);
            } catch (e) {
                console.log('Error getting team: ', e);
                await transaction.rollback();
                callback(['databaseError']);
            }
        },
        deleteTeamById: async (teamid, callback) => {
            const transaction = await Sequelize.transaction();
            try {
                const deleteRes = await Team.destroy({ where: { id: teamid } });
                // { teamid: teamid } === { teamid } 
                const updateRes = await Account.update(
                    { teamid: null, currentbarrunda: null },
                    { where: { teamid } }
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
                    { teamid: null, currentbarrunda: null },
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
                const [team] = await Team.findAll({ where: { teamname: teamName } });
                if (!team) callback('No team found', null); 
                const update = await Account.update(
                    { teamid: team.dataValues.id },
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
        //TODO: updateRundaForMemebers
    }
}
