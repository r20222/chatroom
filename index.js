
/* Losjes gebaseerd op https://socket.io/get-started/chat */

import * as path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const http = createServer(app)
const ioServer = new Server(http)
const port = process.env.PORT || 8000

// Om de history te kunnen zien
const historySize = 50

let history = []


// Om de connecties bij te houden
let connections = 0



// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))




// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Tel er 1 connectie bij op
  connections++
 
  // Log de connectie naar console
  console.log(`user ${client.id} connected, total connections ${connections}`)

    // Stuur het aantal connecties naar alle clients
    ioServer.emit('connectionCount', connections);


  // Stuur de historie door, let op: luister op socket, emit op io!
  ioServer.emit('history', history)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {

    // Log het ontvangen bericht
    console.log(`user ${client.id} sent message: ${message}`)

     // Check de maximum lengte van de historie
     while (history.length > historySize) {
      history.shift()
    }
    // Voeg het toe aan de historie
    history.push(message)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // haal 1 connectie eraf
    connections--
    // Log de disconnect
    console.log(`user ${client.id} disconnected, total connections: ${connections}`)

      // Stuur het aantal connecties naar alle clients
    ioServer.emit('connectionCount', connections);

  })
})

// Maak een route voor de index 
app.get('/', (request, response) => {
 
  fetchJson().then((data) => {
    response.render('index')
  })
})

    // definieer de fetchJson functie
    async function fetchJson(url) {
      return await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)
    }


// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})