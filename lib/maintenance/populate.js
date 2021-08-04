import mongoose from 'mongoose';
import Roster from '../../db/Roster.js'
import Scraper from '../scraper/scraper.js'
import Team from '../../db/Team.js'
import Standing from '../../db/Standing.js'
import Helpers from '../helpers/helpers.js'
import dotenv from 'dotenv';

dotenv.config()

const connection_url = process.env.CONNECTION_URL
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})


const populateRoster = async (teamID) => {
  console.log(`Scraping team ${teamID}...`)
  const players = await Scraper.fortyMan(teamID)
  console.log(`Finished Scraping ${teamID}`)
  console.log(`Updating Database ${teamID}...`)
  await Roster.deleteOne({teamID: teamID})
  await Roster.create({teamID, players})
  console.log(`Finished Updating ${teamID}`)
  return
}

/**
 * Scrapes teams and populates db with current rosters
 * @returns Promise
 */
const populateRosters = async () => {
  const teamIDS = await Scraper.teamIDS()
  for (let i = 0; i < teamIDS.length; i += 6) {
    let promises = []
    let slice = teamIDS.slice(i, i + 6)
    for (let teamID of slice) {
      promises.push(populateRoster(teamID))
    }
    await Promise.all(promises)
  }
  return
}

const populateTeam = async (teamID) => {
  console.log(`Scraping ${teamID}`)
  const {name, logo} = await Scraper.teamData(teamID)
  await Team.deleteMany({teamID})
  await Team.create({name, teamID, logo})
  console.log(`Finished populating ${teamID}`)
  return
}

/**
 * Scrapes teams and populates db with current teams
 * @returns Promise
 */
const populateTeams = async () => {
  const teamIDS = await Scraper.teamIDS()
  let promises = []
  for (let teamID of teamIDS) {
    promises.push(populateTeam(teamID));
  }
  await Promise.all(promises)
  return
}

/**
 * Scrapes records and updates db with current standings
 * @returns Promise
 */
const populateStandings = async () => {
  const records = await Scraper.records()
  const standings = Helpers.Data.genStandings(records)
  const {AL, NL} = standings
  await Standing.deleteMany({})
  await Standing.create({AL, NL})
  return
}

const run = async() => {
  await populateTeams()
  await populateRosters()
  await populateStandings()
  return
}


await run()
mongoose.disconnect()
