let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let naam = document.querySelector('#naam')
let bericht = document.querySelector('#bericht')
let form = document.querySelector('form')


form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (input.value) {
    socket.emit('message', {
    naam: naam.value,
    bericht: bericht.value
  }),
    bericht.value = ''
  }
})

socket.on('message', (message) => {
  addMessage(`${message.naam}: ${message.bericht}`)
})

socket.on('whatever', (message) => {
  addMessage(message)
})

// Met het onderstaande word het aantal connecties bijgewerkt
socket.on('connectionCount', (count) => {
  const connectionCountElement = document.querySelector('#connection-count')
  if (connectionCountElement) {
    connectionCountElement.textContent = `Personen online: ${count}`
  }
})

socket.on('history', (history) => {
  history.forEach((message) => {
    addMessage(`${message.naam}: ${message.bericht}`)
  })
})

function addMessage(message) {
  const currentTime = new Date().toLocaleTimeString('nl-NL', { hour: 'numeric', minute: 'numeric' });
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.appendChild(Object.assign(document.createElement('span'), { textContent: currentTime }));
  messages.scrollTop = messages.scrollHeight

 
}

