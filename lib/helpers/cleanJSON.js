const players = (json) => {
  const {
    firstName, 
    lastName,
    bbrefID,
    retroID, 
    dob, 
    dod, 
    birthCity, 
    birthState,
    birthCountry,
    deathCity,
    deathState,
    deathCountry,
    weight,
    height,
    bats,
    throws,
    debut,
  } = json

  return {
    firstName, 
    lastName,
    bbrefID,
    retroID, 
    dob, 
    dod, 
    birthCity, 
    birthState,
    birthCountry,
    deathCity,
    deathState,
    deathCountry,
    weight,
    height,
    bats,
    throws,
    debut,
  } 
}

export default {players}