/**
 * Takes a json object representing a player and cleans it by removing some properties
 * @param {object} player
 */

const cleanPlayer = (player) => {
  const {
    firstName, lastName, bbrefID, retroID, dob, 
    dod, birthCity, birthState, birthCountry,
    deathCity, deathState, deathCountry,
    weight, height, bats, throws, debut,
  } = player

  if (deathCountry) {
    return {
      firstName, lastName, bbrefID, retroID, dob, 
      dod, birthCity, birthState, birthCountry,
      deathCity, deathState, deathCountry,
      weight, height, bats, throws, debut,
    } 
  } else {
    return {
      firstName, lastName, bbrefID, retroID, dob, 
      birthCity, birthState, birthCountry, weight,
      height, bats, throws, debut,
    } 
  }
  
}

/**
 * Takes two team objects and calculates games back based on w/l differentials
 * @param {object} teamA 
 * @param {object} teamB 
 * @returns {number} gamesBack
 */
const calcGamesBack = (teamA, teamB) => {
  let teamADiff = teamA.w - teamA.l
  let teamBDiff = teamB.w- teamB.l

  return ((teamADiff - teamBDiff) / 2)
}

/**
 * Takes an array of team objects and adds gamesBack (gb) properties to them
 * @param {array} division
 * @returns 
 */
const addGamesBack = (division) => {
  let topTeam = division[0];
  topTeam.gb = 0
  for (let i = 1; i < division.length; i++) {
    let team = division[i];
    team.gb = calcGamesBack(topTeam, team)
  }
  return division
}

/**
 * Takes an array of divs from a league (AL or NL) and returns the wild card standings
 * @param {array} divs 
 * @returns {array} Wild Card Standings
 */
const calcWildCard = (divs) => {
  const divLeaders = [];
  const teams = [];
  let wcTeams = [];
  
  // Calculate wcTeams, divLeaders, and add copies of teams to teams array
  for (let div of divs) {
    for (let i = 0; i < div.length; i++) {
      let team = Object.assign({}, div[i])
      teams.push(team)
      if (i === 0) {
        divLeaders.push(team);
        continue;
      }
      let tempWCTeams = Object.assign([], wcTeams)
      tempWCTeams.push(team);
      tempWCTeams.sort((a, b) => (b.w - b.l) - (a.w - a.l))
      if (tempWCTeams.indexOf(team) < 2) {
        // only keep 2 wild card teams
        if (tempWCTeams.length === 3) 
          tempWCTeams.pop()
        
        wcTeams = tempWCTeams;
      }
    }
  }
  
  // sort teams based on w/l differential
  teams.sort((a, b) => (b.w - b.l) - (a.w - a.l))
  // find index of team in league standings
  let idx = teams.findIndex(t => t.teamID === wcTeams[1].teamID)
  let standings = teams.slice(0, idx).concat(addGamesBack(teams.slice(idx)))
  standings.forEach(e => {if (!Object.keys(e).includes('gb')) e.gb = 0})
  
  return standings
}

/**
 * Takes a JSON object of records and returns an object representing standings.
 * @param {object} records 
 * @returns {object} standings
 */
const genStandings = (records) => {
  let leagues = Object.values(records);

  for (let league of leagues) {
    let divs = Object.values(league);
    // add property WC to league obj which will act as another division
    league.WC = calcWildCard(divs)
    
    // Need to keep track of wild card eligibility
    let divLeaders = []
    for (let div of divs) {
      divLeaders.push(div[0].teamID)
    }
    
    for (let div of divs) {
      div = addGamesBack(div)
    }
  }

  return records
}


export default {cleanPlayer, genStandings}

