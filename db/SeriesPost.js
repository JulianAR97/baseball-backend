import mongoose from 'mongoose';

const seriesPostSchema = mongoose.Schema({
  yearID: String,
  round: String,
  teamIDwinner: String,
  lgIDwinner: String,
  teamIDloser: String,
  lgIDloser: String,
  wins: String,
  losses: String,
  ties: String
})

export default mongoose.model('seriesPost', seriesPostSchema)