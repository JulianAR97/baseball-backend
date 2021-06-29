import mongoose from 'mongoose';

const allStarFullSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  gameNum: String,
  gameID: String,
  teamID: String,
  lgID: String,
  gp: String,
  startingPos: String
})

export default mongoose.model('allStarFull', allStarFullSchema);