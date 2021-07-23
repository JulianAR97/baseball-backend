import { scrapeBoxscore as boxscore } from "./boxscore.js";
import { getScores as scores, getOdds as odds } from "./scoreboard.js";
import { scrapeStats as stats, scrape40Man as fortyMan, getActive as active} from './bbRef.js'


export default {boxscore, scores, odds, stats, fortyMan, active}