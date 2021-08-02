/**
 * Takes a json object representing a player and cleans it by removing some properties
 * @param Object
 */

const cleanPlayer = (json) => {
  const {
    firstName, lastName, bbrefID, retroID, dob, 
    dod, birthCity, birthState, birthCountry,
    deathCity, deathState, deathCountry,
    weight, height, bats, throws, debut,
  } = json

  if (deathCountry) {
    return {
      firstName, lastName, bbrefID, retroID, dob, 
      dod, birthCity, birthState, birthCountry,
      deathCity, deathState, deathCountry,
      weight, height, bats, throws, debut,
    } 
  } else {
    return {
      firstName, lastName, bbrefID, retroID, dob, 
      birthCity, birthState, birthCountry, weight,
      height, bats, throws, debut,
    } 
  }
  
}
cleanPlayer
export default {cleanPlayer}