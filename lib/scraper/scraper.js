import { scrapeBoxscore as boxscore } from "./boxscore.js";
import { getScores as scores, getOdds as odds } from "./scoreboard.js";
import { scrapeStats as stats, scrape40Man as fortyMan, scrapeCurrentTeamIDS as teamIDS} from './bbRef.js'
i


export default {boxscore, scores, odds, stats, fortyMan, teamIDS}