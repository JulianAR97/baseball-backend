import { scrapeBoxscore as boxscore } from "./boxscore.js";
import { getScores as scores, getOdds as odds } from "./scoreboard.js";
import { 
  scrape40Man as fortyMan, 
  scrapeCurrentTeamIDS as teamIDS, 
  scrapeTeamData as teamData,
  scrapeRecords as records
} from './bbRef.js'



export default {boxscore, scores, odds, records, fortyMan, teamIDS, teamData}