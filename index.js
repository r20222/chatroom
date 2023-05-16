
/* Losjes gebaseerd op https://socket.io/get-started/chat */

import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const http = createServer(app)
const ioServer = new Server(http)
const port = process.env.PORT || 8000

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {
    // Log het ontvangen bericht
    console.log(`user ${client.id} sent message: ${message}`)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`)
  })
})

// Stel de view engine in
app.set('view engine', 'ejs')
app.set('views', './views')

// // Stel de public map in
// app.use(express.static('public'))


// Maak een route voor de index /categories
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