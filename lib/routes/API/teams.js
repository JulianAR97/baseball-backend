import express from 'express';
import TeamsFranchises from '../../../db/TeamsFranchises.js'
import Helpers from '../../helpers/helpers.js'

const router = express.Router()

// Returns all teams
router.get('/', (req, res) => {
  TeamsFranchises.find((err, data) => {
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
router.get('/:franchID', (req, res) => {
  const { franchID } = req.params;
  
  TeamsFranchises.find({franchID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})


// 40 man roster
router.get('/:teamID/40man', async (req, res) => {
  const { teamID } = req.params
  const teamRoster = await Roster.find({teamID})
  const playerIDS = teamRoster[0].players.map(p => p.bbrefID)
  
  await people.find({'bbrefID': {$in: playerIDS}}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(p => Helpers.Data.cleanPlayer(p))
      res.status(200).json(data)
    }
  })
  
})

// active roster
router.get('/:teamID/active', async (req, res) => {
  const {teamID} = req.params
  const teamRoster = await Roster.find({teamID})
  const playerIDS = teamRoster[0].players.filter(p => p.active).map(p => p.bbrefID)
  await people.find({'bbrefID': {$in: playerIDS}}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(p => Helpers.Data.cleanPlayer(p))
      res.status(200).json(data)
    }
  })
})



export default router