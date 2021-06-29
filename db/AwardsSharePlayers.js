import mongoose from 'mongoose';

const awardsSharePlayersSchema = mongoose.Schema({
  awardID: String,
  yearID: String,
  lgID: String,
  playerID: String,
  pointsWon: String,
  pointsMax: String,
  votesFirst: String
})

export default mongoose.model('awardSharePlayers', awardsSharePlayersSchema);