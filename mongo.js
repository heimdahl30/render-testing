require('dotenv').config()

const mongoose = require('mongoose')

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI)
  .then(result => console.log('MongoDB connected'))
  .catch(err => console.log(err))

module.exports = mongoose

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const name = process.argv[3]
const number = process.argv[4]

mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Jake Sullivan',
  number: '888'
})

if (process.argv.length > 3){

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

else if (process.argv.length === 3 ){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
