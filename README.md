# Baseball Api

## Objective
The purpose of this project is to create a free api for baseball statistics. The statistics provided by the project are current through the 2020 season. Eventually I would like to scrape for statistics daily. 

### How to use
* Once hosted, more information will be added
* Routes
  * /api/people
  * /api/teams
  * /api/teams/:franchID
  * /api/active/teams
  * /api/people/:playerID
  * /api/search/people?
  * /api/search/teams?
  * /api/stats/teams/:franchID
  * /api/stats/batting/:playerID
  * /api/stats/pitching/:playerID
* Examples
  * /api/search/people?nameLast=degrom => returns infromation about Jacob Degrom
  * /api/stats/pitching/degroja01 => returns Jacob Degrom statistics

### Future Plans
[] Add advanced statistics to use for analytics\ 
[] Update database by scraping web daily for statistics\
[] Add a frontend to display data\