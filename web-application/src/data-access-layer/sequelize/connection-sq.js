const Sequelize = require('sequelize');

const sequelize = new Sequelize('webAppDatabase', 'root', 'jade123', {
    host: 'database',
    dialect: 'mysql'
  });

const a = async ()=>{
    try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
a()

module.exports = sequelize;


