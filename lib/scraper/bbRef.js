import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import Helpers from '../helpers/helpers.js'
import fetch from 'node-fetch'

const BASEURL = 'https://baseball-reference.com'

const getData = async (url, nodeType) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']})
  const page = await browser.newPage();
  await page.goto(url);
  const content = await page.content()
  const $ = cheerio.load(content)
  const elements = $(nodeType).toArray()
  
  browser.close();
  return elements;
}

const depthFirstData = (collection, data = []) => {
  collection.forEach(
    ele => {
      if (ele.data) {
        /* 
          Some of the data starts with a newline character
          We don't want this data, so we can protect against it here
        */
        
        if (ele.data.match(/\w/)) {data.push(ele.data)}
        if (!ele.children || !ele.children[0]) { return data }
      }
      if (ele.children && ele.children[0]) { depthFirstData(ele.children, data) }
    }
  )
  return data
}

export const scrapeCurrentTeamIDS = async() => {
  const ths = await getData(BASEURL, 'th[csk]')
  const teamIDS = ths
    .map(th => th.attribs.csk)
    .filter(
      (e, i, a) => 
        a.indexOf(e) === i && 
        e.match(/[A-Z]{3}/)
    )
  
  return teamIDS
}

const parse40Body = (body) => {
  let players = []
  let rows = body.children
  
  // Already have a database of players, so we just need their name, number, statuses
  const dataStatsToKeep = ['name', 'number', 'active', 'dl']
  const sanitizeKeys = {
    'uniform_number': 'number',
    'player': 'name',
    'is_active': 'active',
    'is_dl': 'dl'
  }

  for (let row of rows) {
    let player = {}
    let tds = row.children
    
    if (tds) {
      for (let td of tds) {
        let dataStat = 
          sanitizeKeys[td.attribs['data-stat']] || 
          td.attribs['data-stat'] // Try dataStat    
        
        let data = depthFirstData(td.children)[0]
        
        // Don't care about this stat
        if (!dataStatsToKeep.includes(dataStat)) 
          continue

        if (dataStat === 'active') {
          data = td.children[0]?.data
        }
        
        // switch active and dl categories to booleans
        if (['active', 'dl'].includes(dataStat))
          data = !!data
    
        player[dataStat] = data
      } 
    }
    if (Object.keys(player).includes('name')) {
      player.name = Helpers.Strings.latinize(player.name)
      players.push(player)
    }
      
  } 
  
  return players
}

const getPlayerID = async (href, playerName) => {
  // bbref ids are first five letters of last name + first 2 letters of first name + 2 numbers
  // if last name is shorter than five letters, the id is simply shorter
  const [firstName, lastName] = playerName.split(' ')
  const regexLetters = lastName.toLowerCase().slice(0, 5) + firstName.toLowerCase().slice(0, 2)
  const regex = new RegExp(`${regexLetters}\\d{2}`, "g")
  
  const url = BASEURL + href
  const page = await fetch(url)
    .then(res => res.text())
    .then(body => body)
  

  let playerID = page.match(regex)?.shift() || ''

  return playerID
}

const getAllIDS = async (body) => {
  let players = {};
  let trs = body.children.filter(t => t.name === 'tr');

  for (let i = 0; i < trs.length; i++) {
    let tr = trs[i]
    
    if (tr.children) {
      
      // td will have an an aTag child 
      const td = tr.children.find(c => c.attribs && c.attribs['data-stat'] === 'player')
      
      // aTag will have an attribute wih href that redirects to page with player's bbrefID
      const a = td.children.find(c => c.name === 'a') || 
                td.children[0].children.find(c => c.name === 'a')
      
      const href = a.attribs.href
      
      const playerName = Helpers.Strings.latinize(a.children.find(c => c.type === 'text').data)
      
      const id = await getPlayerID(href, playerName)
      
      // use playerName as key instead of id because of faster lookup
      players[playerName] = id
    }
  }
  
  return players
}

export const scrape40Man = async (teamID, year = new Date().getFullYear()) => {
  const url = BASEURL + `/teams/${teamID}/${year}.shtml`

  let players = [];
  
  const table = await getData(url, '#the40man')
  
  if (table[0]) {
    const body = table[0].children.find(c => c.name === 'tbody')
    players = parse40Body(body)
    players = players.sort((a, b) => Helpers.compareNames(a.name, b.name))
    
    const playerIDS = await getAllIDS(body)
    
    
    players.forEach(
      player => 
        player.bbrefID = playerIDS[player.name]
    )    
  }
  
  return players
}

export const scrapeTeamData = async (teamID) => {
  const url = BASEURL + `/teams/${teamID}`

  const page = await fetch(url)
    .then(res => res.text())
    .then(body => body)

  const $ = cheerio.load(page)
  const logo = $('img.teamlogo').toArray()[0].attribs.src
  const aTags = $(`a[href = "/teams/${teamID}/${new Date().getFullYear()}.shtml"]`).toArray()
  let name = aTags.find(
    t => 
      t.children &&
      // regex matches both 'New York Mets' and 'St. Louis Cardinals' 
      t.children[0].data.match(/^[A-Z][a-z]*.?\s.*[A-Z][a-z]*[a-z]$/)
  ).children[0].data
  
  // stored in database as abbreviation
  let abbreviation = teamID
  
  return {abbreviation, name, logo}
}

export const getActive = async (teamID) => {
  let players = await scrape40Man(teamID)

  return players.filter(p => p.active)
}







