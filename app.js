const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

let db = null

const dbPath = path.join(__dirname, 'cricketTeam.db')

const initializationDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializationDBAndServer()

//API-1

app.get('/players/', async (request, response) => {
  const playerDetailsQuery = `
  SELECT 
  *
  FROM 
  cricket_team
  ORDER BY
  player_id;`

  const playerDetails = await db.all(playerDetailsQuery)
  response.send(playerDetails)
})

//API-2

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jersyNumber, role} = playerDetails
  const addPlayerQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        
        '${playerName}',
         ${jersyNumber},
        '${role}',
        
      );`

  const dbResponse = await db.run(addPlayerQuery)

  response.send('done')
})

//API-3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetailsQuery = `
  SELECT 
  * 
  FROM 
  cricket_team 
  WHERE 
  player_id = ${playerId};`

  const bdResponse = await db.get(playerDetailsQuery)
  response.send(bdResponse)
})

//API-4

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body

  const {playerID, playerName, jersyNumber, role} = playerDetails

  const updatePlayerDetailsQuery = `
  UPDATE 
    cricket_team
  SET 
    player_id =${playerId},
    player_name = '${playerName}',
    jersey_number=${jersyNumber},
    role=${role};
  WHERE player_id = ${playerId};`

  await db.run(updatePlayerDetailsQuery)
  response.send('Player Details Updated')
})

//API-5

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const deletePlayerQuery = `
  DELETE FROM
  cricket_team
  WHERE player_id = ${playerId};`

  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
