const models = require('../models')

const getAllSagas = async (request, response) => {
  try {
    const sagas = await models.sagas.findAll()

    return response.send(sagas)
  } catch (error) {
    return response.status(500).send('Unable to retrieve the sagas, try again.')
  }
}

const getSagaById = async (request, response) => {
  try {
    const { id } = request.params
    const sagaMatch = await models.sagas.findOne({
      where: {
        [models.Op.or]: [
          { id },
          { name: { [models.Op.like]: `%${id.toLowerCase()}%` } }
        ]
      },
      include: [{ include: [{ model: models.races }], model: models.characters }],
    })

    return sagaMatch
      ? response.send(sagaMatch)
      : response.status(404).send(`Unable to find a saga with a matching id of ${id}`)
  } catch (error) {
    return response.status(500).send('Unable to retrieve the saga, try again.')
  }
}

const saveNewSaga = async (request, response) => {
  try {
    const { name } = request.body

    if (!name) return response.status(400).send('You are missing the required field: saga')

    const [newSaga] = await models.sagas.findOrCreate({
      where: { name }
    })

    return response.send(newSaga)
  } catch (error) {
    return response.status(500).send('Unable to save the saga, try again.')
  }
}

const deleteSaga = async (request, response) => {
  try {
    const { name } = request.body

    const saga = await models.sagas.findOne({ where: { name } })

    if (!saga) return response.status(404).send(`No saga matching the name: ${name}`)

    await models.charactersSagas.destroy({ where: { sagaId: saga.id } })

    await models.sagas.destroy({ where: { name } })

    return response.send(`Successfully deleted the saga: ${name}.`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting saga, please try again.')
  }
}

module.exports = { getAllSagas, getSagaById, saveNewSaga, deleteSaga }
