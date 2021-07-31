import assert from 'assert';
import mongoose from 'mongoose';
import People from '../db/People.js'
import dotenv from 'dotenv';
import Helpers from '../lib/helpers/helpers.js'

// grab our environment variables
dotenv.config()

// import data from database
const connection_url = process.env.CONNECTION_URL

console.log('Fetching data from database....')
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const peopleData = await People.find({})
mongoose.disconnect()
console.log('Done')

// tests

describe('DB', function() {
  describe('People', function() {
  
    describe('birthMonth', function() {
      let birthMonths = peopleData.map(p => p.birthMonth)
      
      it('should be of type string', function() {
        let bmTypes = birthMonths.map(bm => typeof bm)
  
        assert.strictEqual(bmTypes[0], 'string')
        assert.strictEqual(Helpers.Filter.noUniqueValues(bmTypes), true)
      })
      
      it ('should be of length 2', function() {
        let bmLengths = birthMonths.map(bm => bm.length)
  
        assert.strictEqual(bmLengths[0], 2)
        assert.strictEqual(Helpers.Filter.noUniqueValues(bmLengths), true)
      })
      
    })

    describe('birthYear', function() {
      let birthYears = peopleData.map(p => p.birthYear)

      it('should be of type string', function() {
        let byTypes = birthYears.map(by => typeof by)

        assert.strictEqual(byTypes[0], 'string')
        assert.strictEqual(Helpers.Filter.noUniqueValues(byTypes), true)
      })

      it('should be of length 4', function() {
        let byLengths = birthYears.map(by => by.length)

        assert.strictEqual(byLengths[0], 4)
        assert.strictEqual(Helpers.Filter.noUniqueValues(byLengths), true)
      })
    })

    describe('birthDay', function() {
      let birthDays = peopleData.map(p => p.birthDay)

      it('should be of type string', function() {
        let bdTypes = birthDays.map(bd => typeof bd)

        assert.strictEqual(bdTypes[0], 'string')
        assert.strictEqual(Helpers.Filter.noUniqueValues(bdTypes), true)
      })

      it('should be of length 2', function() {
        let bdLengths = birthDays.map(bd => bd.length)

        assert.strictEqual(bdLengths[0], 2)
        assert.strictEqual(Helpers.Filter.noUniqueValues(bdLengths), true)
      })
    })
  })

})