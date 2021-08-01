import chai, { expect } from 'chai';
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
  
        expect(bmTypes[0]).to.be.a('string')
        expect(Helpers.oneUniqueElement(bmTypes)).to.be.true
      })
      
      it ('should be of length 2', function() {
        let bmLengths = birthMonths.map(bm => bm.length)
  
        expect(bmLengths[0]).to.equal(2)
        expect(Helpers.oneUniqueElement(bmLengths)).to.be.true
      })
      
    })

    describe('birthYear', function() {
      let birthYears = peopleData.map(p => p.birthYear)

      it('should be of type string', function() {
        let byTypes = birthYears.map(by => typeof by)

        expect(byTypes[0]).to.be.a('string')
        expect(Helpers.oneUniqueElement(byTypes)).to.be.true
      })

      it('should be of length 4', function() {
        let byLengths = birthYears.map(by => by.length)

        expect(byLengths[0]).to.equal(4)
        expect(Helpers.oneUniqueElement(byLengths)).to.be.true
      })
    })

    describe('birthDay', function() {
      let birthDays = peopleData.map(p => p.birthDay)

      it('should be of type string', function() {
        let bdTypes = birthDays.map(bd => typeof bd)

        expect(bdTypes[0]).to.be.a('string')
        expect(Helpers.oneUniqueElement(bdTypes)).to.be.true
      })

      it('should be of length 2', function() {
        let bdLengths = birthDays.map(bd => bd.length)

        expect(bdLengths[0]).to.equal(2)
        expect(Helpers.oneUniqueElement(bdLengths)).to.be.true
      })
    })
  })

})