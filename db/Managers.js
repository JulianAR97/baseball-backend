import mongoose from 'mongoose';

const managersSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  teamID: String,
  lgID: String,
  inseason: String,
  G: String,
  W: String,
  L: String,
  rank: String,
  plyrMgr: String
})

export default mongoose.model('managers', managersSchema)