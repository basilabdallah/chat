const socket = io();

const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');

function typeMessage(message, callback) {
  const messageElement = document.createElement('div');
  chatLog.appendChild(messageElement);

  let i = 0;
  function type() {
    if (i < message.length) {
      messageElement.innerHTML += message.charAt(i);
      i++;
      chatLog.scrollTop = chatLog.scrollHeight;
      setTimeout(type, 30); // Adjust typing speed here
    } else if (callback) {
      callback();
    }
  }
  type();
}

let messageQueue = [];
let isTyping = false;

function processQueue() {
  if (messageQueue.length > 0 && !isTyping) {
    isTyping = true;
    const message = messageQueue.shift();
    typeMessage(message, () => {
      isTyping = false;
      processQueue();
    });
  }
}

socket.on('message', (message) => {
  messageQueue.push(message);
  processQueue();
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && chatInput.value.trim() !== '') {
    const command = chatInput.value;
    // Echo the command to the user's screen immediately for better feedback
    const commandElement = document.createElement('div');
    commandElement.innerText = `> ${command}`;
    commandElement.style.color = '#7f7f7f'; // Style for user command
    chatLog.appendChild(commandElement);
    chatLog.scrollTop = chatLog.scrollHeight;

    socket.emit('command', command);
    chatInput.value = '';
  }
});
