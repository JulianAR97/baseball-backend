import Data from './data.js'
import API from './api.js'

/** 
 * Takes two strings (names) and compares them alphabetically.
 * @param nameA string  ex: 'Jane Doe'.
 * @param nameB string  ex: 'John Foe'.
*/
const compareNames = (nameA = "", nameB = "") => {
  const [firstNameA, lastNameA] = nameA.split(' ').map(n => n.toLowerCase());
  const [firstNameB, lastNameB] = nameB.split(' ').map(n => n.toLowerCase());

  if (lastNameA < lastNameB) { return -1 }
  if (lastNameA > lastNameB) { return 1 }
  if (lastNameA === lastNameB) { 
    if (firstNameA < firstNameB) { return -1 }
    if (firstNameA > firstNameB) { return 1 }
  }
  return 0
}

/** 
 * Takes an array and returns a new array containing unique values.
 * @param array array
*/ 
const unique = (array = []) => {
  return [...new Set(array)]
}

/** 
 * Takes an array and returns true if all elements are the same, false otherwise.
 * @param array array
*/
const oneUniqueElement = (array = []) => {
  return unique(array).length === 1
}

/**
 * Takes an query object, and adds case-insensitive matching to each key.
 * @example 
 * addCaseInsensitive({firstName: 'John', lastName: 'Doe'})
 * returns: { firstName: { $regex: 'John', $options: 'i' }, lastName: { $regex: 'Doe', $options: 'i' } }
 * @param Object query
 * @return Object  
 */
const addCaseInsensitive = (query = {}) => {
  for (let k in query) {
    query[k] = { $regex: `${query[k]}`, $options: 'i' }
  }
  return query
}


export default { 
  API,
  Data, 
  compareNames, 
  unique,
  oneUniqueElement,
  addCaseInsensitive, 
}
