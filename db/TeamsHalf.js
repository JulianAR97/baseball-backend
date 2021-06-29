import mongoose from 'mongoose';

const teamsHalfSchema = mongoose.Schema({
  yearID: String,
  lgID: String,
  teamID: String,
  Half: String,
  divID: String,
  DivWin: String,
  Rank: String,
  G: String,
  W: String,
  L: String,
})

export default mongoose.model('teamsHalf', teamsHalfSchema)