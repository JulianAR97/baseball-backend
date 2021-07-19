import fetch from 'node-fetch';
import cheerio from 'cheerio';

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

const getScores = async (url) => {
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

const getOdds = async (url) => {
  const data = await getData(url)
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

export const scrapeScoreboard = async (params) => {
  const baseURL = "https://www.espn.com/mlb/scoreboard"
  let data;
  switch (params.type) {
    case 'ODDS':
      data = await getOdds(baseURL)
      break;
    
    case 'SCORES':
      let url =
        params.date ?
        baseURL + `/_/date/${params.date}` :
        baseURL

      data = await getScores(url)

    default:
      break;
  }

  return data;
}

export const scrapeBoxscore = async (gameID) => {
  const url = `https://www.espn.com/mlb/boxscore/_/gameId/${gameID}`
  const website = await fetch(url)
    .then(res => res.text())
    .then(body => body)

  const $ = cheerio.load(website);
  const trClassesOk = [
    "baseball-lineup__player-row"
  ]
  
  let rows = await $("tr").toArray()
  
  rows = rows.filter(s => 
    trClassesOk.indexOf(s.attribs.class) !== -1
  )
  
  let boxscore = {away: {}, home: {}}
  let batting = [];
  let pitching = [];
  
  // these variables will act like switches to know when to switch teams
  let currentType = 'batter'
  let switchTypeCount = 0;

  rows.forEach(row => {
    
    let type = 
      row.children.find(c => 
        c.attribs.class.includes('pitching')
      ) ? 'pitcher' : 'batter'
    
    if (type != currentType) { 
      currentType = type
      switchTypeCount += 1;
      if (switchTypeCount === 2) {
        boxscore.away.batting = batting;
        boxscore.away.pitching = pitching;
        batting = [];
        pitching = [];
      }
    }

    if (type === 'batter') {
      batting.push(parseBatterRow(row))
    } else {
      pitching.push(parsePitcherRow(row))
    }
    
  })
  
  if (boxscore.away.batting) {
    boxscore.home.batting = batting;
    boxscore.home.pitching = pitching;
  } 
  
  return {boxscore}
}


// parsing functions for boxscore
const parseBatterRow = (row) => {
  let playerData = {}
  
  row.children.forEach(c => {
    let klass = c.attribs.class
    
    if (klass === 'name') {
      let aTag = c.children.find(tag => tag.name === 'a')
      let span = aTag.children.find(tag => tag.name === 'span')
      let name = span.children.find(child => child.type === 'text').data
      playerData.name = name
    }
    
    let stat = c.children.find(child => child.type === 'text').data
    
    if (klass === 'name') { 
      playerData.pos = stat
    } else {
      if (!klass.includes('h-ab')) {
        let category = klass.split('-')[2]
        playerData[category] = stat
      }
    }
  })

  return playerData
}

const parsePitcherRow = (row) => {
  let playerData = {}
  
  row.children.forEach(c => {
    
    let klass = c.attribs.class.split('-').slice(2).join('-') || 'name'
    let stat
    
    if (klass === 'name') {
      let aTag = c.children.find(tag => tag.name === 'a')
      let span = aTag.children.find(tag => tag.name === 'span')
      stat = span.children.find(child => child.type === 'text').data
    } else {
      stat = c.children.find(child => child.type === 'text').data
    }
    
    playerData[klass] = stat
  })
  
  return playerData
}

