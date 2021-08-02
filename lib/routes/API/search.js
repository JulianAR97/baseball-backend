import express from 'express';
import TeamsFranchises from '../../../db/TeamsFranchises.js'
import People from '../../../db/People.js'
import Helpers from '../../helpers/helpers.js'

const router = express.Router()

router.get('/teams?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = Helpers.addCaseInsensitive(query)
  TeamsFranchises.find(query, (err, data) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

router.get('/players?', (req, res) => {
  let query = Object.assign({}, req.query)
  query = Helpers.addCaseInsensitive(query)
  
  People.find(query, (err, data) => {
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

export default router