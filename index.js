const express = require('express')
const app = express()
var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

const cors = require('cors')

app.use(cors())

let persons = [
      { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: "1"
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: "2"
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: "3"
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: "4"
      }
    ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = (request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })