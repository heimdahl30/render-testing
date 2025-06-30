const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const assert = require('assert')

const url = process.env.MONGO_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    validate: {
      validator: function (v){
        return /^\d{2,3}-\d+/.test(v)
      },
      message: ({ value }) => `${value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  }
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

let error

const tooShortName = new Person({
  name: 'Jo',
  number: '123-45678'
})

error = tooShortName.validateSync()
assert.equal(error.errors['name'].message, 'Name must be at least 3 characters long')


const wrongNumber = new Person({
  name: 'Joan',
  number: '1-45678'
})

error = wrongNumber.validateSync()
assert.equal(error.errors['number'].message, `${wrongNumber.number} is not a valid phone number`)

const wrongNumber1 = new Person({
  name: 'Joan',
  number: '12345678'
})

error = wrongNumber1.validateSync()
assert.equal(error.errors['number'].message, `${wrongNumber1.number} is not a valid phone number`)

const wrongNumber2 = new Person({
  name: 'Joan',
  number: ''
})

error = wrongNumber2.validateSync()
assert.equal(error.errors['number'].message, 'Phone number required')

const wrongNumber3 = new Person({
  name: 'Joan',
  number: 'a12-123455'
})

error = wrongNumber3.validateSync()
assert.equal(error.errors['number'].message, `${wrongNumber3.number} is not a valid phone number`)

const wrongNumber4 = new Person({
  name: 'Joan',
  number: '12-abc'
})

error = wrongNumber4.validateSync()
assert.equal(error.errors['number'].message, `${wrongNumber4.number} is not a valid phone number`)


module.exports = Person