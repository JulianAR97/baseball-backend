import express from 'express'
import gamedataRouter from './gamedata.js';
import playersRouter from './players.js';
import searchRouter from './search.js';
import teamsRouter from './teams.js';
import Helpers from '../../helpers/helpers.js'

const router = express.Router()

router.use('/gamedata', gamedataRouter)
router.use('/players', playersRouter)
router.use('/search', searchRouter)
router.use('/teams', teamsRouter)

router.get('/routes', (req, res) => {
  let routes = {
    "/gamedata": Helpers.API.getRoutes(gamedataRouter),
    "/players": Helpers.API.getRoutes(playersRouter),
    "/search": Helpers.API.getRoutes(searchRouter),
    "/teams": Helpers.API.getRoutes(teamsRouter)
  };
  routes = Helpers.API.concatRoutes(routes)


  res.status(200).send(routes)
})

export default router