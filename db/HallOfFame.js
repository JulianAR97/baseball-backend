import mongoose from 'mongoose';

const hallOfFameSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  votedBy: String,
  ballots: String,
  needed: String,
  votes: String,
  inducted: String,
  category: String,
})

export default mongoose.model('hallOfFame', hallOfFameSchema)