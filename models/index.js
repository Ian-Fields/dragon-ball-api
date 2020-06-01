const sequelize = require('sequelize')
const charactersModel = require('./characters')
const racesModel = require('./races')
const sagasModel = require('./sagas')
const charactersSagasModel = require('./charactersSagas')
const allConfigs = require('../config/sequelize')

const environment = process.env.NODE_ENV || 'development'
const config = allConfigs[environment]

const connection = new sequelize(config.database, config.username, config.password, {
  host: config.host, dialect: config.dialect
})

const races = racesModel(connection, sequelize)
const characters = charactersModel(connection, sequelize, races)
const sagas = sagasModel(connection, sequelize)
const charactersSagas = charactersSagasModel(connection, sequelize, characters, sagas)

characters.belongsTo(races)
races.hasMany(characters)

characters.belongsToMany(sagas, { through: charactersSagas })
sagas.belongsToMany(characters, { through: charactersSagas })

module.exports = {
  characters, races, sagas, charactersSagas, Op: sequelize.Op
}
