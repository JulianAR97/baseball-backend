import express from 'express';
import mongoose from 'mongoose';
import {addCaseInsensitive} from './helpers.js'
import cors from 'cors';
import batting from './db/Batting.js'
import collegePlaying from './db/CollegePlaying.js'
import schools from './db/Schools.js'
import pitching from './db/Pitching.js'
import people from './db/People.js'
import teams from './db/Teams.js'
import teamsFranchises from './db/TeamsFranchises.js'

const app = express();
app.use(express.json())
const port = process.env.PORT || 8001
const connection_url = 'mongodb+srv://admin:6714tQBA5oDLB61E@cluster0.r6nql.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// Helper functions



// Routes 
app.get('/', (req, res) => {
  res.json([])
})

// Returns all people
app.get('/api/people', (req, res) => {
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
  const id = req.params.franchID;
  
  teamsFranchises.find({franchID: id}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

// Returns all active teams
app.get('/api/active/teams', (req, res) => {
  teamsFranchises.find({active: 'Y'}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

// Will finish later
// app.get('/api/active/people', (req, res) => {
//   people.find({finalGame: {$gt: '2020-06-09'}}, (err, data) => {
//     if (err) {
//       res.status(500).json(err)
//     } else {
//       res.status(200).json(data)
//     }
//   })
// })

app.get('/api/people/:playerID', (req, res) => {
  people.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
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

app.get('/api/search/people?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = addCaseInsensitive(query)
  
  people.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

app.get('/api/search/teams?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = addCaseInsensitive(query)
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

  query = addCaseInsensitive(query)
  
  teams.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

/* 
once you have a playerID from player search,
you can use the id which will return player stats from all of their active years
*/
app.get('/api/stats/batting/:playerID', (req, res) => {
  batting.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

app.get('/api/stats/pitching/:playerID', (req, res) => {
  pitching.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})





app.listen(port, () => console.log(`Listening on port ${port}`));


