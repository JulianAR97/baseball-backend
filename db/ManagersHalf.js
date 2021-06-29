import mongoose from 'mongoose';

const managersHalfSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  teamID: String,
  lgID: String,
  inseason: String,
  half: String,
  G: String,
  W: String,
  L: String,
  rank: String,
})

export default mongoose.model('managersHalf', managersHalfSchema)