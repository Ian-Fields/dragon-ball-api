const express = require('express')

const app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (request, response) => {
  return response.status(200).render('index')
})

app.all('*', (request, response) => {
  return response.status(404).send('No Dragon Balls here silly Bulma')
})

app.listen(1337, () => {
  console.log('I am Shenron. I can grant you 1 wish')// eslint-disable-line no-console
})
