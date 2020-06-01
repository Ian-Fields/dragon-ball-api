/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const { getAllCharacters, getCharacterById, saveNewCharacter, deleteCharacter } = require('../../controllers/characters.js')
const { getAllRaces, getRaceById, saveNewRace, deleteRace } = require('../../controllers/races.js')
const { getAllSagas, getSagaById, saveNewSaga, deleteSaga } = require('../../controllers/sagas.js')

const {
  characterList,
  sagaList,
  raceList,
  characterById,
  sagaById,
  raceById,
  newCharacter,
  newRace,
  newSaga
} = require('../mocks/dragon.ball')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - API', () => {
  let sandbox
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusDotSend
  let stubbedStatus
  let stubbedCharactersDestroy
  let stubbedCharactersFindAll
  let stubbedCharactersFindOne
  let stubbedCharactersFindOrCreate
  let stubbedRacesDestroy
  let stubbedRacesFindAll
  let stubbedRacesFindOne
  let stubbedRacesFindOrCreate
  let stubbedSagasDestroy
  let stubbedSagasFindAll
  let stubbedSagasFindOne
  let stubbedSagasFindOrCreate
  let stubbedCharactersSagasDestroy
  let stubbedCharactersSagasFindOrCreate

  before(() => {
    sandbox = sinon.createSandbox()
    stubbedCharactersDestroy = sandbox.stub(models.characters, 'destroy')
    stubbedCharactersFindAll = sandbox.stub(models.characters, 'findAll')
    stubbedCharactersFindOne = sandbox.stub(models.characters, 'findOne')
    stubbedCharactersFindOrCreate = sandbox.stub(models.characters, 'findOrCreate')
    stubbedRacesDestroy = sandbox.stub(models.races, 'destroy')
    stubbedRacesFindAll = sandbox.stub(models.races, 'findAll')
    stubbedRacesFindOne = sandbox.stub(models.races, 'findOne')
    stubbedRacesFindOrCreate = sandbox.stub(models.races, 'findOrCreate')
    stubbedSagasDestroy = sandbox.stub(models.sagas, 'destroy')
    stubbedSagasFindAll = sandbox.stub(models.sagas, 'findAll')
    stubbedSagasFindOne = sandbox.stub(models.sagas, 'findOne')
    stubbedSagasFindOrCreate = sandbox.stub(models.sagas, 'findOrCreate')
    stubbedCharactersSagasDestroy = sandbox.stub(models.charactersSagas, 'destroy')
    stubbedCharactersSagasFindOrCreate = sandbox.stub(models.charactersSagas, 'findOrCreate')
    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()
    stubbedStatus = sandbox.stub()
    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('Characters', () => {
    describe('getCharacters', () => {
      it('returns a list of characters cleaned for the API', async () => {
        stubbedCharactersFindAll.returns(characterList)

        await getAllCharacters({}, response)

        expect(stubbedCharactersFindAll).to.have.callCount(1)
        expect(response.send).to.have.been.calledWith(characterList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedCharactersFindAll.throws('ERROR!')

        await getAllCharacters({}, response)

        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve characters, try again')
      })
    })

    describe('getCharacterById', () => {
      it('returns the character associated with the id passed in', async () => {
        stubbedCharactersFindOne.returns(characterById)

        const request = { params: { identifier: '1' } }

        await getCharacterById(request, response)

        expect(stubbedCharactersFindOne).to.have.been.calledWith({
          include: [
            { model: models.sagas },
            { model: models.races }
          ],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier}%` } }
            ]
          }
        })
        expect(stubbedSend).to.have.been.calledWith(characterById)
        expect(stubbedCharactersFindOne).to.have.callCount(1)
      })

      it('returns a 404 when no character can be found for the id passed in', async () => {
        stubbedCharactersFindOne.returns(null)

        const request = { params: { identifier: '1' } }

        await getCharacterById(request, response)

        expect(stubbedCharactersFindOne).to.have.been.calledWith({
          include: [
            { model: models.sagas },
            { model: models.races }
          ],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier}%` } }
            ]
          }
        })
        expect(stubbedStatus).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`Unable to find an character matching: ${request.params.identifier}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedCharactersFindOne.throws('ERROR!')

        const request = { params: { identifier: '1' } }

        await getCharacterById(request, response)

        expect(stubbedCharactersFindOne).to.have.been.calledWith({
          include: [
            { model: models.sagas },
            { model: models.races }
          ],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier}%` } }
            ]
          }
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve character, try again')
      })
    })

    describe('saveNewCharacter', () => {
      it('returns a 201 with the new character when created', async () => {
        stubbedRacesFindOne.returns(raceById)
        stubbedCharactersFindOrCreate.returns([newCharacter, false])
        stubbedSagasFindOne.returns(sagaById)
        stubbedCharactersSagasFindOrCreate.returns([{ characterId: 1, sagaId: 1 }, false])

        const request = {
          body: {
            name: 'Raditz', race: 'Saiyan', type: 'villain', transformation: 'yes', sagas: ['Saiyan']
          }
        }

        await saveNewCharacter(request, response)

        expect(stubbedCharactersFindOrCreate).to.have.been.calledWith({ where: { name: 'Raditz' }, defaults: { raceId: 1, type: 'villain', transformation: 'yes' } })
        expect(stubbedCharactersSagasFindOrCreate).to.have.been.calledWith({ where: { characterId: newCharacter.id, sagaId: sagaById.id } })
        expect(stubbedSend).to.have.been.calledWith(newCharacter)
      })

      it('returns a 400 when missing data', async () => {
        const request = {
          body: {
            name: 'Raditz', race: '', type: 'villain', transformation: 'yes', sagas: ['Saiyan']
          }
        }

        await saveNewCharacter(request, response)

        expect(stubbedCharactersFindOrCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusDotSend).to.have.been
          .calledWith('You are missing at least one of the required fields: name, race, type, transformation, and/or sagas')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedCharactersFindOrCreate.throws('ERROR!')

        const request = {
          body: {
            name: 'Raditz', race: 'Saiyan', type: 'villain', transformation: 'yes', sagas: ['Saiyan']
          }
        }

        await saveNewCharacter(request, response)

        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save character, try again')
      })
    })

    describe('deleteCharacter', () => {
      it('responds with a success message when the character is deleted', async () => {
        stubbedCharactersFindOne.returns(characterById)
        stubbedCharactersDestroy.returns(0)
        stubbedCharactersSagasDestroy.returns(0)

        const request = { body: { name: 'Goku' } }

        await deleteCharacter(request, response)

        expect(stubbedCharactersFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedCharactersDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.send).to.have.been.calledWith(`Successfully deleted the character: ${request.body.name}.`)
      })

      it('responds with a 404 when no character can be found with the id passed in', async () => {
        stubbedCharactersFindOne.returns(null)

        const request = { body: { name: 'Goku' } }

        await deleteCharacter(request, response)

        expect(stubbedCharactersFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedCharactersDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`No character matching the name: ${request.body.name}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedCharactersFindOne.returns(characterById)
        stubbedCharactersDestroy.throws('ERROR!')

        const request = { body: { name: 'Goku' } }

        await deleteCharacter(request, response)

        expect(stubbedCharactersDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedCharactersDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unknown error while deleting character, please try again.')
      })
    })
  })

  describe('Races', () => {
    describe('getAllRaces', () => {
      it('returns a list of races cleaned for the API', async () => {
        stubbedRacesFindAll.returns(raceList)

        await getAllRaces({}, response)

        expect(stubbedRacesFindAll).to.have.been.calledWith()
        expect(response.send).to.have.been.calledWith(raceList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedRacesFindAll.throws('ERROR!')

        await getAllRaces({}, response)

        expect(stubbedRacesFindAll).to.have.been.calledWith()
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve the race, try again')
      })
    })

    describe('getRaceById', () => {
      it('returns the race associated with the id passed in', async () => {
        stubbedRacesFindOne.returns(raceList)

        const request = { params: { identifier: '1' } }

        await getRaceById(request, response)

        expect(stubbedRacesFindOne).to.have.been.calledWith({
          include: [{
            model: models.characters,
            include: {
              model: models.sagas,
            }
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier.toLowerCase()}%` } }
            ]
          }
        })
        expect(response.send).to.have.been.calledWith(raceList)
      })

      it('returns a 404 when no race can be found for the id passed in', async () => {
        stubbedRacesFindOne.returns(null)

        const request = { params: { identifier: '1' } }

        await getRaceById(request, response)

        expect(stubbedRacesFindOne).to.have.been.calledWith({
          include: [{
            model: models.characters,
            include: {
              model: models.sagas,
            }
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier.toLowerCase()}%` } }
            ]
          }
        })
        expect(stubbedStatus).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`Unable to find a race with a matching: ${request.params.identifier}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedRacesFindOne.throws('ERROR!')

        const request = { params: { identifier: '1' } }

        await getRaceById(request, response)

        expect(stubbedRacesFindOne).to.have.been.calledWith({
          include: [{
            model: models.characters,
            include: {
              model: models.sagas,
            }
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.identifier },
              { name: { [models.Op.like]: `%${request.params.identifier.toLowerCase()}%` } }
            ]
          }
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve the race, try again')
      })
    })

    describe('saveNewRace', () => {
      it('returns a 201 with the new race when created', async () => {
        stubbedRacesFindOne.returns(raceById)
        stubbedRacesFindOrCreate.returns([newRace, false])


        const request = {
          body: {
            name: 'Kaioshin'
          }
        }

        await saveNewRace(request, response)

        expect(stubbedRacesFindOrCreate).to.have.been.calledWith({ where: { name: 'Kaioshin' } })
        expect(stubbedSend).to.have.been.calledWith(newRace)
      })

      it('returns a 400 when missing data', async () => {
        const request = {
          body: {
            name: ''
          }
        }

        await saveNewRace(request, response)

        expect(stubbedRacesFindOrCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusDotSend).to.have.been
          .calledWith('You are missing the required field: race')
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedRacesFindOrCreate.throws('ERROR!')

        const request = {
          body: {
            name: 'Kaioshin'
          }
        }

        await saveNewRace(request, response)

        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save race, try again')
      })
    })

    describe('deleteRace', () => {
      it('responds with a success message when the race is deleted', async () => {
        stubbedRacesFindOne.returns(raceById)
        stubbedRacesDestroy.returns(0)

        const request = { body: { name: 'Saiyan' } }

        await deleteRace(request, response)

        expect(stubbedRacesFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedRacesDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.send).to.have.been.calledWith(`Successfully deleted the race: ${request.body.name}.`)
      })

      it('responds with a 404 when no race can be found with the id passed in', async () => {
        stubbedRacesFindOne.returns(null)

        const request = { body: { name: 'Saiyan' } }

        await deleteRace(request, response)

        expect(stubbedRacesFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedRacesDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`No race matching the name: ${request.body.name}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedRacesFindOne.returns(raceById)
        stubbedRacesDestroy.throws('ERROR!')

        const request = { body: { name: 'Saiyan' } }

        await deleteRace(request, response)

        expect(stubbedRacesDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedRacesDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unknown error while deleting race, please try again.')
      })
    })
  })

  describe('Sagas', () => {
    describe('getAllSagas', () => {
      it('returns a list of sagas cleaned for the API', async () => {
        stubbedSagasFindAll.returns(sagaList)

        await getAllSagas({}, response)

        expect(stubbedSagasFindAll).to.have.been.calledWith()
        expect(response.send).to.have.been.calledWith(sagaList)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedSagasFindAll.throws('ERROR!')

        await getAllSagas({}, response)

        expect(stubbedSagasFindAll).to.have.been.calledWith()
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve the sagas, try again.')
      })
    })

    describe('getSagaById', () => {
      it('returns the saga associated with the id passed in', async () => {
        stubbedSagasFindOne.returns(sagaList)

        const request = { params: { id: '3' } }

        await getSagaById(request, response)

        expect(stubbedSagasFindOne).to.have.been.calledWith({
          include: [{
            include: [{ model: models.races }],
            model: models.characters
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.id },
              { name: { [models.Op.like]: `%${request.params.id.toLowerCase()}%` } }
            ]
          },
        })
        expect(stubbedSend).to.have.been.calledWith(sagaList)
      })

      it('returns a 404 when no saga can be found for the id passed in', async () => {
        stubbedSagasFindOne.returns(null)

        const request = { params: { id: '3' } }

        await getSagaById(request, response)

        expect(stubbedSagasFindOne).to.have.been.calledWith({
          include: [{
            include: [{ model: models.races }],
            model: models.characters
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.id },
              { name: { [models.Op.like]: `%${request.params.id.toLowerCase()}%` } }
            ]
          },
        })
        expect(stubbedStatus).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`Unable to find a saga with a matching id of ${request.params.id}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedSagasFindOne.throws('ERROR!')

        const request = { params: { id: '3' } }

        await getSagaById(request, response)

        expect(stubbedSagasFindOne).to.have.been.calledWith({
          include: [{
            include: [{ model: models.races }],
            model: models.characters
          }],
          where: {
            [models.Op.or]: [
              { id: request.params.id },
              { name: { [models.Op.like]: `%${request.params.id.toLowerCase()}%` } }
            ]
          },
        })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve the saga, try again.')
      })
    })

    describe('saveNewSaga', () => {
      it('returns a 201 with the new saga when created', async () => {
        stubbedSagasFindOne.returns(sagaById)
        stubbedSagasFindOrCreate.returns([newSaga, false])

        const request = {
          body: {
            name: 'Babidi & Majinn Buu'
          }
        }

        await saveNewSaga(request, response)

        expect(stubbedSagasFindOrCreate).to.have.been.calledWith({ where: { name: 'Babidi & Majinn Buu' } })
        expect(stubbedSend).to.have.been.calledWith(newSaga)
      })

      it('returns a 400 when missing data', async () => {
        const request = {
          body: {
            name: ''
          }
        }

        await saveNewSaga(request, response)

        expect(stubbedSagasFindOrCreate).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(400)
        expect(stubbedStatusDotSend).to.have.been
          .calledWith('You are missing the required field: saga')
      })
      it('returns a 500 error when the database calls fails', async () => {
        stubbedSagasFindOrCreate.throws('ERROR!')

        const request = {
          body: {
            name: 'Babidi & Majinn Buu'
          }
        }

        await saveNewSaga(request, response)

        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save the saga, try again.')
      })
    })

    describe('deleteSaga', () => {
      it('responds with a success message when the saga is deleted', async () => {
        stubbedSagasFindOne.returns(sagaById)
        stubbedSagasDestroy.returns(0)

        const request = { body: { name: 'Namek' } }

        await deleteSaga(request, response)

        expect(stubbedSagasFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedSagasDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.send).to.have.been.calledWith(`Successfully deleted the saga: ${request.body.name}.`)
      })

      it('responds with a 404 when no saga can be found with the id passed in', async () => {
        stubbedSagasFindOne.returns(null)

        const request = { body: { name: 'Namek' } }

        await deleteSaga(request, response)

        expect(stubbedSagasFindOne).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedSagasDestroy).to.have.callCount(0)
        expect(response.status).to.have.been.calledWith(404)
        expect(stubbedStatusDotSend).to.have.been.calledWith(`No saga matching the name: ${request.body.name}`)
      })

      it('returns a 500 error when the database calls fails', async () => {
        stubbedSagasFindOne.returns(sagaById)
        stubbedSagasDestroy.throws('ERROR!')

        const request = { body: { name: 'Namek' } }

        await deleteSaga(request, response)

        expect(stubbedSagasDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(stubbedSagasDestroy).to.have.been.calledWith({ where: { name: request.body.name } })
        expect(response.status).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Unknown error while deleting saga, please try again.')
      })
    })
  })
})

