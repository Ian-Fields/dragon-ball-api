const characterList = [{
  id: 5,
  name: 'Freiza',
  race: 'Freiza',
  type: 'villain',
  transformation: 'yes',
}, {
  id: 23,
  name: 'Cell',
  race: 'Android',
  type: 'villain',
  transformation: 'yes',
}]

const sagaList = [{
  id: 1,
  name: 'Saiyan',
}, {
  id: 2,
  name: 'Vegeta',
}, {
  id: 3,
  name: 'Namek',
}, {
  id: 4,
  name: 'Frieza',
}, {
  id: 5,
  name: 'Future Trunks'
}]

const raceList = [{
  id: 4,
  name: 'Freiza',
}, {
  id: 7,
  name: 'Core',
}]

const characterById = {
  id: 1,
  name: 'Goku',
  race: 'Saiyan',
  type: 'hero',
  transformation: 'yes',
}

const sagaById = {
  id: 3,
  name: 'Namek',
}

const raceById = {
  id: 1,
  name: 'Saiyan',
}

const newCharacter = {
  id: 17,
  raceId: 1,
  name: 'Raditz',
  race: 'Saiyan',
  type: 'villain',
  transformation: 'yes',
  sagas: ['Saiyan', 'Vegeta']
}

const newRace = {
  id: 8,
  name: 'Kaioshin',
}

const newSaga = {
  id: 11,
  name: 'Babidi & Majinn Buu',
}

module.exports = {
  characterList,
  sagaList,
  raceList,
  characterById,
  sagaById,
  raceById,
  newCharacter,
  newRace,
  newSaga
}
