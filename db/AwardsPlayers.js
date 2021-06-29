import mongoose from 'mongoose';

const awardsPlayersSchema = mongoose.Schema({
  playerID: String,
  awardID: String,
  yearID: String,
  lgID: String,
  tie: String,
  notes: String
})

export default mongoose.model('awardsPlayers', awardsPlayersSchema)