import mongoose from 'mongoose';

const peopleSchema = mongoose.Schema({
  playerID: String,
  birthYear: String,
  birthMonth: String,
  birthDay: String,
  birthCountry: String,
  birthState: String,
  birthCity: String,
  deathYear: String,
  deathMonth: String,
  deathDay: String,
  deathCountry: String,
  deathState: String,
  deathCity: String,
  nameFirst: String,
  nameLast: String,
  nameGiven: String,
  weight: String,
  height: String,
  bats: String,
  throws: String,
  debut: String,
  finalGame: String,
  retroID: String,
  bbrefID: String
})

export default mongoose.model('people', peopleSchema)