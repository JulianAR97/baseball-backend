import mongoose from 'mongoose';

const battingPostSchema = mongoose.Schema({
  yearID: String,
  round: String,
  playerID: String,
  teamID: String,
  lgID: String,
  G: String,
  AB: String,
  R: String,
  H: String,
  "2B": String,
  "3B": String,
  HR: String,
  RBI: String,
  SB: String,
  CS: String,
  BB: String,
  SO: String,
  IBB: String,
  HBP: String,
  SH: String,
  SF: String,
  GIDP: String 
})

export default mongoose.model('battingPost', battingPostSchema);