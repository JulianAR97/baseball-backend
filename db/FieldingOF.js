import mongoose from 'mongoose';

const fieldingOFSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  stint: String,
  Glf: String,
  Gcf: String,
  Grf: String,
})

export default mongoose.model('fieldingOF', fieldingOFSchema)