import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
  teamID: String,
  name: String,
  logo: String
})

export default mongoose.model('teams', teamSchema)