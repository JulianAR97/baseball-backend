import mongoose from 'mongoose';

const fieldingOFSplitSchema = mongoose.Schema({
  playerID: String,
  yearID: String,
  stint: String,
  teamID: String,
  lgID: String,
  POS: String,
  G: String,
  GS: String,
  InnOuts: String,
  PO: String,
  A: String,
  E: String,
  DP: String,
  PB: String,
  WP: String,
  SB: String,
  CS: String,
  ZR: String,
})

export default mongoose.model('fieldingOFSplit', fieldingOFSplitSchema)