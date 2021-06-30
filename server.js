import express from 'express';
import mongoose from 'mongoose';
import people from './db/People.js'
import teams from './db/Teams.js'
import teamsFranchises from './db/TeamsFranchises.js'
import cors from 'cors';

const app = express();
app.use(express.json())
const port = process.env.PORT || 8001
const connection_url = 'mongodb+srv://admin:6714tQBA5oDLB61E@cluster0.r6nql.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})


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
  console.log(id)
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
  teamsFranchises.find({active: 'Y', franchID: req.franchID})
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
  const query = Object.assign({}, req.query)
  for (let k in query) {
    // this allows to search for lowercase or uppercase
    query[k] = { $regex: `${query[k]}`, $options: 'i' }
  }
  console.log(query)
  
  people.find(query, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));


