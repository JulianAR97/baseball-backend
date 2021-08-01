import mongoose from 'mongoose';

const player = new mongoose.Schema({name: String, bbrefID: String, active: Boolean, dl: Boolean, number: Number})

const rosterSchema = mongoose.Schema({
  teamID: String,
  players: [player]
})

export default mongoose.model('rosters', rosterSchema)