import mongoose from 'mongoose';

const awardsManagersSchema = mongoose.Schema({
  playerID: String,
  awardID: String,
  yearID: String,
  lgID: String,
  tie: String,
})

export default mongoose.model('awardsManagers', awardsManagersSchema)