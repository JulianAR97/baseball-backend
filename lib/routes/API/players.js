import express from 'express';
import People from '../../../db/People.js';
import Helpers from '../../helpers/helpers.js'

const router = express.Router()

// Returns all people
router.get('/', (req, res) => {
  People.find((err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

router.get('/:playerID', (req, res) => {
  People.find({playerID: req.params.playerID}, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      data = data.map(d => Helpers.Data.cleanPlayer(d))
      res.status(200).json(data)
    }
  })
})

export default router
