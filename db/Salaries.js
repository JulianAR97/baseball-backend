import mongoose from 'mongoose';

const salariesSchema = mongoose.Schema({
  yearID: String,
  teamID: String,
  lgID: String,
  playerID: String,
  salary: String
})

export default mongoose.model('salaries', salariesSchema)