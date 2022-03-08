const { Sequelize } = require('sequelize');
const Team = require('../models/Team')
const Account = require('../models/Account')
const Barrunda = require('../models/Barrunda');


const errHandler = (err) =>{
    console.error("Error: ", err);
    
}

module.exports = ({}) => { 

    return {
        storeBarRunda: async (barRunda, account, callback) => {
            await Barrunda.create({
                owner: account.id,
                data: JSON.stringify(barRunda)
            }).catch(errHandler).then( async (newBarrunda) => {
                console.log("NEW newBarrunda:", newBarrunda);

                await Account.update({ currentbarrunda: newBarrunda.dataValues.id }, {
                    where: {
                      id: account.id
                    }
                  }).catch(errHandler).then( () => {

                    callback(null, newBarrunda.dataValues)

                  })
                
            })
        },
        getBarRunda: async (account, callback) => { 
            await Account.findAll({
                attributes: ['currentbarrunda'],
                where: {
                username: account.username
                }
            }).catch(errHandler).then( async (result) => {
                console.log("barrunda ID from account table", result[0].dataValues.currentbarrunda);

                await Barrunda.findAll({
                    where: {
                    id: result[0].dataValues.currentbarrunda
                    }
                }).catch(errHandler).then( (barrundaFound) => {
                    console.log("barrundaFound: ", barrundaFound[0].dataValues);
                    //bars-manager kan inte hantera denna data
                    callback(null, barrundaFound[0].dataValues)
            })
        })
    },
    deleteBarrundaById: async (id, callback) => {
        await Barrunda.destroy({
            where: {
              id: id
            }
          }).catch(errHandler).then( async () => {
            await Account.update({ currentbarrunda: null }, {
                where: {
                    currentbarrunda: id
                }
              }).catch(errHandler).then( async () => {

                await Team.update({ currentbarrunda: null }, {
                    where: {
                        currentbarrunda: id
                    }
                  }).catch(errHandler).then( () => {
    
                    callback(null, null)
    
                  })

              })
          })
    }

    }
}
