import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const scrapeBoxscore = async (gameID) => {
  const url = `https://www.espn.com/mlb/boxscore/_/gameId/${gameID}`

  const website = await fetch(url)
    .then(res => res.text())
    .then(body => body)

  const $ = cheerio.load(website);
  const trClassesOk = [
    "baseball-lineup__player-row"
  ]
  
  const rows = await $("tr").toArray();
  let teamStats = await $("div.team-stats-container").toArray()
  teamStats = collectTeamStats(teamStats)
  
  let playerRows = rows.filter(s => 
    trClassesOk.indexOf(s.attribs.class) !== -1
  )
    
  let boxscore = {away: {}, home: {}}
  let batting = [];
  let pitching = [];
  
  // these variables will act like switches to know when to switch teams
  let currentType = 'batter'
  let switchTypeCount = 0;

  playerRows.forEach(row => {
    
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
    boxscore.home.teamStats = teamStats.homeStats
    boxscore.away.teamStats = teamStats.awayStats
  } 
  
  return boxscore;
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

const collect = (data, collection = []) => {
  data.forEach(
    ele => {
      if (ele.data) {
        collection.push(ele.data)
        if (!ele.children || !ele.children[0]) { return collection }
      }
      if (ele.children && ele.children[0]) {collect(ele.children, collection)}
    }
  )
  return collection
}


const collectTeamStats = (teamStats) => {
  let away = true;
  let currCat = "batting"
  
  let awayStats  = {
    "batting": {},
    "baserunning": {},
    "fielding": {},
    "pitching": {}
  }

  let homeStats = {
    "batting": {},
    "baserunning": {},
    "fielding": {},
    "pitching": {}
  }
  
  let collection = collect(teamStats)
  collect(teamStats)

  let i = 0;
  while (i < collection.length) {
    // Use regex to remove redundant 'Team' and ':' for object keys
    let key = collection[i]
      .replaceAll(new RegExp(/:|Team/, 'g'), '')
      .toLowerCase()
      .trim()
      
    let val = collection[i + 1].trim()

    /* 
      *  Four keys in stats object represent the 'main' categories
      *  Switch away to false -- fill home stats --- when we switch categories 
      *  and the away category is already populated
      *  If the key is a 'main' category, it won't have a corresponding value
      *  So we go to the next iteration
      *  Otherwise we use collection[i] as key and collection[i + 1] as value
      *  So we skip over the next iteration
    */
    if (Object.keys(awayStats).includes(key)) {
      currCat = key
      if (Object.keys(awayStats[currCat]).length > 0) {away = false}
      i++
    } else {
      if (away) { awayStats[currCat][key] = val }
      else { homeStats[currCat][key] = val }
      i += 2
    }
  }
  
  return {homeStats, awayStats}
}

