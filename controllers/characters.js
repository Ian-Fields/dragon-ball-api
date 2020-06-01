const models = require('../models')

const getAllCharacters = async (request, response) => {
  try {
    const characters = await models.characters.findAll()

    return response.send(characters)
  } catch (error) {
    return response.status(500).send('Unable to retrieve characters, try again')
  }
}

const getCharacterById = async (request, response) => {
  try {
    const { identifier } = request.params
    const characterMatch = await models.characters.findOne({
      include: [
        { model: models.sagas },
        { model: models.races }
      ],
      where: {
        [models.Op.or]: [
          { id: identifier },
          { name: { [models.Op.like]: `%${identifier.toLowerCase()}%` } }
        ]
      }
    })


    return characterMatch
      ? response.send(characterMatch)
      : response.status(404).send(`Unable to find an character matching: ${identifier}`)
  } catch (error) {
    return response.status(500).send('Unable to retrieve character, try again')
  }
}

const saveNewCharacter = async (request, response) => {
  try {
    const {
      name,
      race,
      type,
      transformation,
      sagas
    } = request.body

    if (!name || !race || !type || !transformation || !sagas) {
      return response
        .status(400)
        .send('You are missing at least one of the required fields: name, race, type, transformation, and/or sagas')
    }

    const existingRace = await models.races.findOne({ where: { name: race } })

    const [newCharacter] = await models.characters.findOrCreate({
      where: { name },
      defaults: { raceId: existingRace.id, type, transformation }
    })

    sagas.forEach(async saga => {
      const existingSaga = await models.sagas.findOne({ where: { name: saga } })

      await models.charactersSagas.findOrCreate({ where: { characterId: newCharacter.id, sagaId: existingSaga.id } })
    })

    return response.send(newCharacter)
  } catch (error) {
    return response.status(500).send('Unable to save character, try again')
  }
}

const deleteCharacter = async (request, response) => {
  try {
    const { name } = request.body

    const character = await models.characters.findOne({ where: { name } })

    if (!character) return response.status(404).send(`No character matching the name: ${name}`)

    await models.charactersSagas.destroy({ where: { characterId: character.id } })

    await models.characters.destroy({ where: { name } })

    return response.send(`Successfully deleted the character: ${name}.`)
  } catch (error) {
    return response.status(500).send('Unknown error while deleting character, please try again.')
  }
}

module.exports = { getAllCharacters, getCharacterById, saveNewCharacter, deleteCharacter }
