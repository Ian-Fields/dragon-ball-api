const express = require('express')
const bodyParser = require('body-parser')
const { getAllCharacters, getCharacterById, saveNewCharacter, deleteCharacter } = require('./controllers/characters')
const { getAllRaces, getRaceById, saveNewRace, deleteRace } = require('./controllers/races')
const { getAllSagas, getSagaById, saveNewSaga, deleteSaga } = require('./controllers/sagas')

const app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (request, response) => {
  return response.status(200).render('index')
})

app.get('/characters', getAllCharacters)

app.get('/characters/:identifier', getCharacterById)

app.post('/characters', bodyParser.json(), saveNewCharacter)

app.delete('/characters', bodyParser.json(), deleteCharacter)

app.get('/races', getAllRaces)

app.get('/races/:identifier', getRaceById)

app.post('/races', bodyParser.json(), saveNewRace)

app.delete('/races', bodyParser.json(), deleteRace)

app.get('/sagas', getAllSagas)

app.get('/sagas/:id', getSagaById)

app.post('/sagas', bodyParser.json(), saveNewSaga)

app.delete('/sagas', bodyParser.json(), deleteSaga)

app.all('*', (request, response) => {
  return response.status(404).send('No Dragon Balls here silly Bulma')
})

app.listen(1337, () => {
  console.log('I am Shenron. I can grant you 1 wish')// eslint-disable-line no-console
})
