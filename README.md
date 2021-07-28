# Baseball Api

## Objective
The purpose of this project is to create a free api for baseball statistics. The statistics provided by the project are current through the 2020 season. Eventually I would like to scrape for statistics daily. 

### How to use
* Base URL is https://baseball-api-nodejs.herokuapp.com
* Routes
  * /api/routes will display all routes
  * Note: This project currently uses web scraping to get data, so as I work to move data into a database, it will be a bit slow. This is compounded by the fact that I am hosting this project for free on herokuapp. For now, you should be able to fetch from the following routes in an acceptable amount of time
    * /api/people => returns all people
    * /api/teams => returns all teams
    * /api/teams/:franchID => returns specific team
    * /api/search/people? => searches for people with a query
    * /api/search/teams? => search for teams with a query
    * /api/stats/teams/:franchID => returns team stats for a specific team
    * /api/odds => returns game odds for current day (Won't show odds for games that already started)
    * /api/scoreboard => returns scoreboard for current day
    * /api/scoreboard/:yyyy/:mm/:dd => returns scoreboard for specific day
    * /api/boxscore/:gameID => returns boxscore for specific game

* Examples
  * /api/search/people?nameLast=degrom => returns infromation about Jacob Degrom
  * /api/stats/pitching/degroja01 => returns Jacob Degrom statistics

### Future Plans

[] Add a frontend to display data<br/>