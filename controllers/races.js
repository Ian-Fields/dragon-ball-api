const models = require('../models')

const getAllRaces = async (request, response) => {
  try {
    const races = await models.races.findAll()

    return response.send(races)
  } catch (error) {
    return response.status(500).send('Unable to retrieve the race, try again')
  }
}

const getRaceById = async (request, response) => {
  try {
    const { identifier } = request.params
    const raceMatch = await models.races.findOne({
      include: [{
        model: models.characters,
        include: {
          model: models.sagas,
        }
      }],
      where: {
        [models.Op.or]: [
          { id: identifier },
          { name: { [models.Op.like]: `%${identifier.toLowerCase()}%` } }
        ]
      }
    })

    return raceMatch
      ? response.send(raceMatch)
      : response.status(404).send(`Unable to find a race with a matching: ${identifier}`)
  } catch (error) {
    return response.status(500).send('Unable to retrieve the race, try again')
  }
}

const saveNewRace = async (request, response) => {
  try {
    const { name } = request.body

    if (!name) return response.status(400).send('You are missing the required field: race')

    const [newRace] = await models.races.findOrCreate({
      where: { name }
    })

    return response.send(newRace)
  } catch (error) {
    return response.status(500).send('Unable to save race, try again')
  }
}

const deleteRace = async (request, response) => {
  try {
    const { name } = request.body

    const race = await models.races.findOne({ where: { name } })

    if (!race) return response.status(404).send(`No race matching the name: ${name}`)

    await models.races.destroy({ where: { name } })

    return response.send(`Successfully deleted the race: ${name}.`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting race, please try again.')
  }
}

module.exports = { getAllRaces, getRaceById, saveNewRace, deleteRace }
