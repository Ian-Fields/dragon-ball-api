const charactersSagas = (connection, sequelize, sagas, characters) => {
  return connection.define('charactersSagas', {
    characterId: { type: sequelize.INTEGER, references: { model: characters, key: 'id' } },
    sagaId: { type: sequelize.INTEGER, references: { model: sagas, key: 'id' } },
  }, { defaultScope: { attributes: { exclude: ['deletedAt'] } } }, { paranoid: true })
}

module.exports = charactersSagas
