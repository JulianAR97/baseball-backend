import mongoose from 'mongoose';

const homeGamesSchema = mongoose.Schema({
  yearID: String,
  leagueId: String,
  teamID: String,
  parkId: String,
  firstGame: String,
  lastGame: String,
  games: String,
  openings: String,
  attendance: String
})

export default mongoose.model('homeGames', homeGamesSchema)