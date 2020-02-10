const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())

morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))


let persons = [
  { name: 'Arto Hellas', number: '040-123456',id:0},
  { name: 'Ada Lovelace', number: '39-44-5323523',id:1},
  { name: 'Dan Abramov', number: '12-43-234345',id:2},
  { name: 'Mary Poppendieck', number: '39-23-6423122',id:3}
]

app.get('/info', (req, res) => {
  const info = `Phonebook contains ${persons.length} contacts.</br>${new Date()}`
  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person):res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {

  const body = req.body;

  body.name && body.number ||  res.status(400).json({error: 'content mia'}).end()

  persons.filter(person => person.name === body.name).length
  && res.status(400).json({error: 'Name must be unique'}).end()

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  res.json(person)
})
const generateId = () => {
  return Math.floor(Math.random()*99999999+4)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})