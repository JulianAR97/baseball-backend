import express from 'express';
import Team from '../../../db/Team.js'
import Helpers from '../../helpers/helpers.js'
import Roster from '../../../db/Roster.js'
import People from '../../../db/People.js'

const router = express.Router()

// Returns all teams
router.get('/', (req, res) => {
  Team.find((err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})


router.get('/:teamID', (req, res) => {
  const { teamID } = req.params;
  
  Team.find({teamID}, (err, data) => {
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
  
  await People.find({'bbrefID': {$in: playerIDS}}, (err, data) => {
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
  const { teamID } = req.params
  const teamRoster = await Roster.find({teamID})
  const playerIDS = teamRoster[0].players.filter(p => p.active).map(p => p.bbrefID)
  await People.find({'bbrefID': {$in: playerIDS}}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(p => Helpers.Data.cleanPlayer(p))
      res.status(200).json(data)
    }
  })
})



export default router