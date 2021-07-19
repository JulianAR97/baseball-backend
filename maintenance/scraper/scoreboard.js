import fetch from 'node-fetch';
import cheerio from 'cheerio';

const baseURL = "https://www.espn.com/mlb/scoreboard"

const getData = async (url) => {
  console.log('Pulling data...')
  
  const website = await fetch(url)
    .then(res => res.text())
    .then(body => body)

  const $ = cheerio.load(website);
  const scripts = await $("script").toArray()

  const scoreboard = scripts.find(
    s => 
      s.children[0] &&
      s.children[0].data.includes("window.espn.scoreboardData")
    ).children[0].data

  let data = scoreboard
    .replace("window.espn.scoreboardData", "")
    .replace("=", '')
    .replace(/;/g, '')
    .split("window.espn.scoreboardSettings")[0]
    .trim();

  data = JSON.parse(data)
  const { events } = data
  return events;
}

// Parsing Functions

export const getScores = async (date) => {
  const url = date ? baseURL + `/_/date/${date}` : baseURL 
  console.log(url)
  const data = await getData(url)
  
  console.log('Parsing scores...')
  let parsed = [];
  
  for (let game of data) {
    const name = game.shortName
    const competitors = game.competitions[0].competitors
    const homeRuns = competitors.find(c => c.homeAway === 'home').score
    const awayRuns = competitors.find(c => c.homeAway === 'away').score
    const homeName = name.split('@')[1].trim()
    const awayName = name.split('@')[0].trim()
    const gameID = game.competitions[0].id
    const dateTime = dateToEST(game.competitions[0].date)
    const {date, time} = dateTime
    const score = { [awayName]: awayRuns, [homeName]: homeRuns }
    const boxscore = `/api/boxscore/${gameID}`
    const status = 
      game.status.type.description === 'Final' ? 
      game.status.type.detail :
      game.status.type.description
    
    const scoreInfo = {gameID, name, score, date, time, status, boxscore}
    parsed.push(scoreInfo)
  
  }

  console.log('Done')
  return parsed;
}

export const getOdds = async () => {
  const data = await getData(baseURL)
  console.log('Parsing odds...')
  let parsed = []
  
  for (let game of data) {
    const name = game.shortName
    const odds = game.competitions[0].odds
    if (odds) {
      const moneyLine = odds[0].details || 'n/a'
      const overUnder = odds[0].overUnder || 'n/a'
      const oddsInfo = {name, moneyLine, overUnder}
      parsed.push(oddsInfo)
    }
  }

  console.log('Done')
  return parsed;
}

// Helpers
const dateToEST = (date) => {
  date = new Date(
    Date.parse(date)
  )

  let dateObj = {}
  
  const options = { 
    time: {
      timeZone: 'America/New_York',
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit'
    },
    date: {
      timeZone: 'America/New_York', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    }
  }

  dateObj.date = date.toLocaleDateString('en-US', options.date)
  dateObj.time = date.toLocaleTimeString('en-US', options.time)
  
  return dateObj
}



// Run

// export const scrapeScoreboard = async (params) => {
//   const baseURL = "https://www.espn.com/mlb/scoreboard"
//   let data;
//   switch (params.type) {
//     case 'ODDS':
//       data = await getOdds(baseURL)
//       break;
    
//     case 'SCORES':
//       let url =
//         params.date ?
//         baseURL + `/_/date/${params.date}` :
//         baseURL

//       data = await getScores(url)

//     default:
//       break;
//   }

//   return data;
// }