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