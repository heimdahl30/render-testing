require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

console.log(Person)

const app = express()
app.use(express.json())

app.use(express.static('dist'))

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

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const requestTime = new Date()
  Person.countDocuments().then(count => {
    response.send(`<div><p>Phonebook has info for ${count} people.</p><p>${requestTime}</p></div>`)
  })
 })

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id 
  Person.find({_id: id}).then(person => {
 if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
})

app.delete('/api/persons/:id', (request, response, next) => {
  
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
  response.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
  name: `${body.name}`,
  number: `${body.number}`
})

  person.save().then(result => {
  console.log("new person added to the database")
  response.status(201).json(result);
})
.catch(error => next(error))
})

app.put('/api/persons/:id', (request,response, next) => {
  const id = request.params.id
  const body = request.body
 
  Person.findByIdAndUpdate(id,{number: body.number},{new: true}).then(updatedData => {
    if(updatedData){
      console.log("Update successful")
      return response.status(201).json(updatedData);
    }
    else if (!updatedData) {
      console.log("Update failed")
      return response.status(404).end();
    }
  })
  .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  else if (error.name === 'ValidationError') {
  return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})