import chai, { expect } from 'chai';
import Helpers from '../lib/helpers/helpers.js'

describe('Helper Functions', function() {
  describe('unique()', function() {
    const unique = Helpers.unique
    
    it('should be a function', function() {
      expect(unique).to.be.a('function')
    })
    
    it('should filter out elements that are not unique', function() {
      expect(unique([1, 2, 3, 1])).to.deep.equal([1, 2, 3])
    })
    
    it('should return an empty array when not passed a parameter', function() {
      expect(unique()).to.deep.equal([])
    })

  })

  describe('oneUniqueElement()', function() {
    const oneUniqueElement = Helpers.oneUniqueElement
    
    it('should be a function', function() {
      expect(oneUniqueElement).to.be.a('function')
    })

    it('should return false when not passed a parameter', function() {
      expect(oneUniqueElement()).to.be.false
    })
    
    it('should return true when passed an array with no unique elements', function() {
      expect(oneUniqueElement([1, 1, 1, 1, 1])).to.be.true
    })
    
    it('should return false when passed an array with more than one unique element', function() {
      expect(oneUniqueElement([1, 1, 2, 1, 1])).to.be.false
    })
    
    it('should return true when passed an array with one value', function() {
      expect(oneUniqueElement([1])).to.be.true
    })

  })

  describe('compareNames()', function() {
    const compareNames = Helpers.compareNames
    
    it('should be a function', function() {
      expect(compareNames).to.be.a('function')
    })

    it('should return -1 when nameA is alphabetically before nameB', function() {
      expect(compareNames('Jane doe', 'john Doe')).to.equal(-1)
    })

    it('should return 1 when nameA is alphabetically after nameB', function() {
      expect(compareNames('Matt Smith', 'mark smith')).to.equal(1)
    })

    it('should return 0 if names are the same', function() {
      expect(compareNames('John Doe', 'john doe')).to.equal(0)
    })
  
  })

  describe('addCaseInsensitive()', function() {
    const addCaseInsensitive = Helpers.addCaseInsensitive
    
    it('should be a function', function() {
      expect(addCaseInsensitive).to.be.a('function')
    })

    it('should return an object', function() {
      expect(addCaseInsensitive()).to.be.an('object')
    })

    it('should return an object where values of keys are objects', function() {
      let fnReturn = addCaseInsensitive({firstName: 'John', lastName: 'Doe'})
      let fnReturnVals = Object.values(fnReturn)
      for (let val of fnReturnVals) {
        expect(val).to.be.an('object')
      }
    })
    
    it ('should return an object where nested keys are $regex and $options', function() {
      let fnReturn = addCaseInsensitive({firstName: 'John', lastName: 'Doe'})
      let fnReturnVals = Object.values(fnReturn)
      for (let val of fnReturnVals) {
        expect(Object.keys(val)).to.deep.equal(['$regex', '$options'])
      }

    })
        
  })

})