import express from 'express';
import mongoose from 'mongoose';
import Scraper from './lib/scraper/scraper.js'
import cors from 'cors';
import batting from './db/Batting.js'
import pitching from './db/Pitching.js'
import people from './db/People.js'
import teams from './db/Teams.js'
import teamsFranchises from './db/TeamsFranchises.js'
import {config as dotenvConfig} from 'dotenv'
import Helpers from './lib/helpers/helpers.js'

// Get environment variables for developing locally
if (process.env.NODE_ENV !== 'production') {
  dotenvConfig();
}


// const corsOptions = {
//   "origin": "*",
//   "methods": "GET"
// }

const app = express();
app.use(express.json())
app.use(cors())

// Connect to Database
const connection_url = process.env.CONNECTION_URL
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})


// Routes 
app.get('/', (req, res) => {
  res.status(200).json([])
})


app.get('/api/routes', (req, res) => {
  const routes = app._router.stack.map(
    r => 
    r.route?.path || ''
  )
  .filter(
    r => 
      r.match(/\/api/)
  )
  res.status(200).json(routes)
})

// Returns all people
app.get('/api/players', (req, res) => {
  people.find((err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

// Returns all teams
app.get('/api/teams', (req, res) => {
  teamsFranchises.find((err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

/*
Returns basic info provided a franchID
franchID can be found by using the search route or by listing all teams and manually finding it
*/
app.get('/api/teams/:franchID', (req, res) => {
  const {franchID} = req.params;
  
  teamsFranchises.find({franchID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})


// 40 man roster
app.get('/api/teams/:franchID/40man', async (req, res) => {
  const {franchID} = req.params
  const data = await Scraper.fortyMan(franchID)
  res.status(200).json(data)
})

// active roster
app.get('/api/teams/:franchID/active', async (req, res) => {
  const {franchID} = req.params
  const data = await Scraper.active(franchID)
  res.status(200).json(data)
})


app.get('/api/players/:playerID', (req, res) => {
  people.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(d => Helpers.Data.cleanPlayer(d))
      res.status(200).json(data)
    }
  })
})


/* 
Search Routes For Teams and People
Both are case insensitive, so don't worry about capitalization

Search For People
Easiest way is to add query params for first name and last name
e.g. /api/search/people?nameLast=degrom&nameFirst=jacob

Search For Teams
Easiest way is to add query params for franchName
e.g. /api/search/teams?franchName=angels
*/

app.get('/api/search/players?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = Helpers.addCaseInsensitive(query)
  
  people.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(
        d => 
          Helpers.Data.cleanPlayer(d) // organizes data
      )  
      res.status(200).json(data)
    }
  })
})

app.get('/api/search/teams?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = Helpers.addCaseInsensitive(query)
  teamsFranchises.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

/*
Once you search for a team, you can find team stats by using the franchID returned by team Search
e.g. /api/stats/teams/ana => searches for Angels
Returns team stats from 1961-2020
*/

app.get('/api/stats/teams/:franchID', (req, res) => {
  // const franchID = req.params.franchID
  let query = Object.assign({}, req.query)
  query.franchID = req.params.franchID;

  query = Helpers.addCaseInsensitive(query)
  
  teams.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})


app.get('/api/stats/players/:playerID', async (req, res) => {
  const data = await Scraper.stats(req.params.playerID)
  res.status(200).json(data)
})

// Live data
app.get('/api/odds', async (req, res) => {
  const data = await Scraper.odds()
  res.status(200).json(data)
})

app.get('/api/scoreboard', async (req, res) => {
  const data = await Scraper.scores()
  res.status(200).json(data)
})

app.get('/api/scoreboard/:yyyy/:mm/:dd', async (req, res) => {
  const date = req.params.yyyy + req.params.mm + req.params.dd
  const data = await Scraper.scores(date)
  res.status(200).json(data)
})

app.get('/api/boxscore/:gameID', async (req, res) => {
  const data = await Scraper.boxscore(req.params.gameID)
  res.status(200).json(data)
})

// Listen
const port = process.env.PORT || 8001
app.listen(port, () => console.log(`Listening on port ${port}`));


