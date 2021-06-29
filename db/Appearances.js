import mongoose from 'mongoose';

const appearancesSchema = mongoose.Schema({
  yearID: String,
  teamID: String,
  lgID: String,
  playerID: String,
  G_all: String,
  GS: String,
  G_batting: String,
  G_defense: String,
  G_p: String,
  G_c: String,
  G_1b: String,
  G_2b: String,
  G_3B: String,
  G_SS: String,
  G_lf: String,
  G_cf: String,
  G_rf: String,
  G_of: String,
  G_dh: String,
  G_ph: String,
  G_ph: String,
  G_pr: String
})

export default mongoose.model('appearances', appearancesSchema);