import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import Helpers from '../helpers/helpers.js'
import fetch from 'node-fetch'


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

const BASEURL = 'https://baseball-reference.com'

const sanitizeKeys = {
  'uniform_number': 'number',
  'player': 'name',
  'is_active': 'active',
  'is_dl': 'dl'
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

const parseHead = (head) => {
  let headers = []

  let headRows = head.children?.filter(c => c.name === 'tr') || [];
  for (let row of headRows) {
    let rowData = depthFirstData(row.children)
    
    if (rowData.length > headers.length) {
      headers = rowData
    }
  }

  return headers;
  
}

const parseBody = (tBody) => {
  let rows = []

  let bodyRows = tBody.children?.filter(c => c.name === 'tr') 
  for (let row of bodyRows ) {
    let rowData = depthFirstData(row.children)

    rows.push(rowData)
  }

  return rows
  
}

const parseTables = (tables) => {
  let parsed = [];

  for (let table of tables) {
    let oTable = {};
    
    if (table.attribs.id)
      oTable.id = table.attribs.id

   
    let caption = 
      table.children?.find(
        c => c.name === 'caption'
      )?.children[0].data

    oTable.caption = caption
    
    let head = table.children?.find(c => c.name === 'thead')
    let body = table.children?.find(c => c.name === 'tbody')
    
    // We don't want the tables that don't have a header
    if (!head) continue;
    
    let headData = parseHead(head)
    let bodyData = parseBody(body)
    
   
    oTable.headers = headData
    oTable.body = bodyData
    parsed.push(oTable)
  } 

  return parsed;
  
}

const checkHeaders = (headers) => {
  if (headers[0] != 'Rk') {
    return headers
  } else {
    headers.splice(3, 0, 'Country')
    headers.splice(5, 0, 'Type')
    return headers;
  }
}

const convertToJSON = (data) => {
  let jsonObject = {}

  for (let table of data) {
    let caption = table.caption
    jsonObject[caption] = []

    let headers = checkHeaders(table.headers)

    let body = table.body
    
    for (let i = body.length - 1; i >= 0; i-- ) {
      let rowObject = {}
      let row = body[i];

      for (let jdx in row) {
        let head = headers[jdx]
        let stat = row[jdx];
        rowObject[head] = stat
      }
      
      // if it's not an empty row
      if (!!Object.keys(rowObject)[0])
        jsonObject[caption].push(rowObject)
    }
  }
  return jsonObject
}

const parse40Body = (body) => {
  let players = []
  let rows = body.children
  
  // Already have a database of players, so we just need their name, number, statuses
  const dataStatsToKeep = ['name', 'number', 'active', 'dl']

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
      players.push(player)
    }
      
  } 
  
  return players
}

export const scrapeStats = async (playerID) => {
  let fc = playerID[0] || ''
  const url = BASEURL + `/players/${fc}/${playerID}.shtml`
  
  console.log(`Scraping data from ${url}...`)
  
  let tables = await getData(url, 'table')
  let json = convertToJSON(parseTables(tables))

  console.log('done')
  return json
}

const getPlayerID = async (href) => {
  const url = 'https://baseball-reference.com' + href
  const page = await fetch(url)

  let playerID = page.url
                .split('/')
                .slice(-1)[0]
                .split('.')[0]

  return playerID
}

const getAllIDS = async (body) => {
  let players = {};
  let trs = body.children.filter(t => t.name === 'tr');

  let ts = Date.now()
  for (let i = 0; i < trs.length; i++) {
    let tr = trs[i]
    
    if (tr.children) {
      
      // td will have an an aTag child 
      const td = tr.children.find(c => c.attribs && c.attribs['data-stat'] === 'player')
      
      // aTag will have an attribute wih href that redirects to page with player's bbrefID
      const a = td.children.find(c => c.name === 'a') || 
                td.children[0].children.find(c => c.name === 'a')
      
      const href = a.attribs.href
      
      const playerName = a.children.find(c => c.type === 'text').data
      
      console.log(`Scraping player ${i + 1} of ${trs.length}`)
      
      const id = await getPlayerID(href)
      
      // use playerName as key instead of id because of faster lookup
      players[playerName] = id
    }
  }
  console.log(`Scraping players took ${(Date.now() - ts) / 1000} seconds`)
  return players
}

export const scrape40Man = async (teamID, year = new Date().getFullYear()) => {
  const url = BASEURL + `/teams/${teamID}/${year}.shtml`
  let players = [];
  
  console.log(`Scraping rosters from ${teamID}`)
  const table = await getData(url, '#the40man')
  
  if (table[0]) {
    const body = table[0].children.find(c => c.name === 'tbody')
    players = parse40Body(body)
    players = players.sort((a, b) => Helpers.compareNames(a.name, b.name))
    
    console.log()
    console.log('Scraping ids...')
    
    const playerIDS = await getAllIDS(body)
    
    console.log('Finished scraping ids')
    
    players.forEach(
      player => 
        player.bbrefID = playerIDS[player.name]
    )    
  }
  

  console.log('done')
  return players

}


export const getActive = async (teamID) => {
  let players = await scrape40Man(teamID)

  return players.filter(p => p.active)
}







