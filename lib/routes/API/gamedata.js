import express from 'express';
import Scraper from '../../scraper/scraper.js'

const router = express.Router();

router.get('/odds', async (req, res) => {
  const data = await Scraper.odds()
  res.status(200).json(data)
})

router.get('/scoreboard', async (req, res) => {
  const data = await Scraper.scores()
  res.status(200).json(data)
})

router.get('/scoreboard/:yyyy/:mm/:dd', async (req, res) => {
  const date = req.params.yyyy + req.params.mm + req.params.dd
  const data = await Scraper.scores(date)
  res.status(200).json(data)
})

router.get('/boxscore/:gameID', async (req, res) => {
  const data = await Scraper.boxscore(req.params.gameID)
  res.status(200).json(data)
})

export default router;