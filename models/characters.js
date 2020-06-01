const characters = (connection, sequelize, races) => {
  return connection.define('characters', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize.STRING, allowNull: false },
    raceId: { type: sequelize.INTEGER, references: { model: races, key: 'id' } },
    type: { type: sequelize.STRING, allowNull: false },
    transformation: { type: sequelize.STRING, allowNull: false },
  }, { defaultScope: { attributes: { exclude: ['deletedAt'] } } }, { paranoid: true })
}

module.exports = characters
