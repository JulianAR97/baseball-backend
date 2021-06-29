import mongoose from 'mongoose';

const fieldingPostSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  teamID: String,
  lgID: String,
  round: String,
  POS: String,
  G: String,
  GS: String,
  InnOuts: String,
  PO: String,
  A: String,
  E: String,
  DP: String,
  TP: String,
  PB: String,
  SB: String,
  CS: String,
})

export default mongoose.model('fieldingPost', fieldingPostSchema)