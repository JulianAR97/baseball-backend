import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import batting from './db/Batting.js'
import collegePlaying from './db/CollegePlaying.js'
import schools from './db/Schools.js'
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

const addCaseInsensitive = (query) => {
  for (let k in query) {
    query[k] = { $regex: `${query[k]}`, $options: 'i' }
  }
  console.log(query)
  return query
}

// Routes 
app.get('/', (req, res) => {
  people.find((err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/people', (req, res) => {
  people.find((err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/teams', (req, res) => {
  teamsFranchises.find((err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/teams/:franchID', (req, res) => {
  const id = req.params.franchID;
  
  teamsFranchises.find({franchID: id}, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/active/teams', (req, res) => {
  teamsFranchises.find({active: 'Y'}, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/active/teams/:franchID/players', (req, res) => {
  
})

app.get('/api/active/people', (req, res) => {
  people.find({finalGame: {$gt: '2020-06-09'}}, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/people/:playerID', (req, res) => {
  people.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/search/people', (req, res) => {
  let query = Object.assign({}, req.query)
  query = addCaseInsensitive(query)
  
  people.find(query, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/search/teams', (req, res) => {
  let query = Object.assign({}, req.query)
  query = addCaseInsensitive(query)
  teamsFranchises.find(query, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('/api/stats/teams/:franchID', (req, res) => {
  // const franchID = req.params.franchID
  let query = Object.assign({}, req.query)
  query.franchID = req.params.franchID;

  query = addCaseInsensitive(query)
  
  teams.find(query, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.get('api/teams/:franchID/people', (req, res) => {
  let query = Object.assign({}, req.query)
  query.franchID = req.params.franchID

  query = addCaseInsensitive(query)

  teams.find(query)
})


app.get('/api/stats/batting/:playerID', (req, res) => {
  batting.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})



app.listen(port, () => console.log(`Listening on port ${port}`));


