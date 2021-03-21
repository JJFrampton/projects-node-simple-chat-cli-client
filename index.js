const blessed = require('blessed');
const axios = require('axios');
const chatSrv = 'https://chat-jjf.herokuapp.com';
const io = require('socket.io-client');

let socket = io(chatSrv)

socket.on('chat message', (msg)=>{
  postList.addItem(msg);
  msgInput.focus(); // need to return focus to the input
  screen.render();
});

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  cursor: {
    blink : true,
    color: 'yellow'
  }
});
screen.title = 'Chat client';

let postList = blessed.list({
  keys: 'vi',
  width: '100%',
  height: '80%'
});

let form = blessed.form({
  keys: 'vi',
  style: {
    bg: 'blue'
  },
  top: '80%',
  width: '100%'
});

var msgInput = blessed.textbox({
    parent: form,
    name: 'msg',
    height: '100%',
    inputOnFocus: true,
    border: { type: 'line' },
    focus: { fg: 'white' }
});

form.on('submit', (data)=>{
  socket.emit('chat message', data.msg);
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Send message on enter
msgInput.key(['enter'], function() {
  form.submit();
  form.reset();
  screen.render();
})

// append list to screen
screen.append(postList);
screen.append(form);

// Focus our element.
msgInput.focus();

// Render the screen.
screen.render();
