import puppeteer from 'puppeteer'
import cheerio from 'cheerio'


const getData = async (url, nodeType) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']}),
  
  const page = await browser.newPage();
  await page.goto(url);
  const content = await page.content()
  const $ = await cheerio.load(content)
  const elements = await $(nodeType)
  


  browser.close();
  return elements;
}

const sanitize40Keys = {
  'uniform_number': 'number',
  'player': 'name',
  'flag': 'country',
  'POS': 'position',
  'is_active': 'active',
  'is_dl': 'dl',
  'date_of_birth': 'dob',
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
  
  for (let row of rows) {
    let player = {}
    let tds = row.children
    
    if (tds) {
      for (let td of tds) {
        let dataStat = 
          sanitize40Keys[td.attribs['data-stat']] || 
          td.attribs['data-stat'] // Try dataStat    
        
        let data = depthFirstData(td.children)[0]
        
        // Don't care about this stat
        if (['ranker', 'first_year'].includes(dataStat)) 
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
    if (!!Object.keys(player)[0])
      players.push(player)
  } 

  return players
}


export const scrapeStats = async (playerID) => {
  let fc = playerID[0] || ''
  const url = `https://www.baseball-reference.com/players/${fc}/${playerID}.shtml`
  
  console.log(`Scraping data from ${url}...`)
  
  let tables = await getData(url, 'table')
  let json = convertToJSON(parseTables(tables))

  console.log('done')
  return json
}

export const scrape40Man = async (teamID) => {
  const year = new Date().getFullYear()
  const url = `https://www.baseball-reference.com/teams/${teamID}/${year}.shtml`

  console.log(`Scraping data from ${url}`)

  let table = await getData(url, '#the40man')


  let body = table[0].children.find(c => c.name === 'tbody')

  let players = parse40Body(body)
  
  console.log('done')
  return players
}

export const getActive = async (teamID) => {
  let players = await scrape40Man(teamID)

  return players.filter(p => p.active)
}


