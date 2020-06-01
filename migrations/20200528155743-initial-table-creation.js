module.exports = {
  up: async (queryInterface, sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.createTable('races', {
      id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: sequelize.STRING, allowNull: false },
      createdAt: { type: sequelize.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: sequelize.DATE },
    })

    await queryInterface.createTable('characters', {
      id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: sequelize.STRING, allowNull: false },
      raceId: { type: sequelize.INTEGER, references: { model: 'races', key: 'id' } },
      type: { type: sequelize.STRING, allowNull: false },
      transformation: { type: sequelize.STRING, allowNull: false },
      createdAt: { type: sequelize.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: sequelize.DATE },
    })

    await queryInterface.createTable('sagas', {
      id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: sequelize.STRING, allowNull: false },
      createdAt: { type: sequelize.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: sequelize.DATE },
    })

    return queryInterface.createTable('charactersSagas', {
      characterId: { type: sequelize.INTEGER, references: { model: 'characters', key: 'id' } },
      sagaId: { type: sequelize.INTEGER, references: { model: 'sagas', key: 'id' } },
      createdAt: { type: sequelize.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: { type: sequelize.DATE },
    })
  },

  down: async (queryInterface) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('characters')

    await queryInterface.dropTable('races')

    await queryInterface.dropTable('sagas')

    return queryInterface.dropTable('charactersSagas')
  }
}
