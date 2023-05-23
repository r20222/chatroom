let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let naam = document.querySelector('#naam')
let bericht = document.querySelector('#bericht')
let form = document.querySelector('form')

const logo = document.querySelector('.logo')

// logo.addEventListener('click', animatie)

// function animatie(){
//   logo.classList.add('animatie')
// }



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

  logo.classList.add('animatie')

  // Verwijder de 'animatie' klasse na een korte vertraging
  setTimeout(() => {
    logo.classList.remove('animatie');
  }, 1000); // Verander de vertraging (in milliseconden) naar jouw wens
})

socket.on('history', (history) => {
  history.forEach((message) => {
    addMessage(`${message.naam}: ${message.bericht}`)
  })
})

function addMessage(message) {
  const currentTime = new Date().toLocaleTimeString('nl-NL', { hour: 'numeric', minute: 'numeric' });
 
  const messageElement = document.createElement('li');
  const timeElement = document.createElement('span');

  messageElement.classList.add('own-message')
  timeElement.classList.add('own-message')

  messages.appendChild(Object.assign(messageElement, { textContent: message }))
  messages.appendChild(Object.assign(timeElement, { textContent: currentTime }));
  messages.scrollTop = messages.scrollHeight

 
}

