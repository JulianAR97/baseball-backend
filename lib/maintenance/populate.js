import mongoose from 'mongoose';
import Roster from '../../db/Roster.js'
import Scraper from '../scraper/scraper.js'
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

const run = async() => {
  await populateRosters()
  
  return
}


await run()
mongoose.disconnect()