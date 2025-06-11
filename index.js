const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => {
  if (req.method === "POST"){
  return JSON.stringify(req.body)
  }

  else {
    return ""
  }
}
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const requestTime = new Date()
 return (
  response.send(`<div><p>Phonebook has info for ${persons.length} people.</p><p>${requestTime}</p></div>`)
 )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id 
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.random() * 10
    : 0
  return String(maxId + persons.length)
}


app.post('/api/persons', (request, response) => {
  const body = request.body
  const repeatedName = persons.filter(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  else if (repeatedName.length > 0){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(persons)
  
})

app.get("/", (request,response) => {
response.send("Hello World!")
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
