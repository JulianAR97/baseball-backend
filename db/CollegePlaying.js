import mongoose from 'mongoose';

const collegePlayingSchema = mongoose.Schema({
  playerID: String,
  schoolID: String,
  yearID: String
})

export default mongoose.model('collegePlaying', collegePlayingSchema)