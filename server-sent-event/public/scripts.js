'use strict'

let source = null;
const chatUser = `user-${Math.random().toString(36).substring(7)}`;

window.onload = () => {
  document.getElementById('userName').innerHTML = chatUser;
  if (source) fetchUsers();

  const sendMessageButton = document.getElementById('sendMessage');
  sendMessageButton.addEventListener('click', sendMessage, false);

  const enterChatButton = document.getElementById('enterChat');
  enterChatButton.addEventListener('click', enterChat, false);

  const leaveChatButton = document.getElementById('leaveChat');
  leaveChatButton.addEventListener('click', leaveChat, false);
}
    
const sendMessage = () => {
  const input = document.getElementById('msg');
  const fetchOption = {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body : JSON.stringify({ msg: input.value })
  };

  fetch('/message', fetchOption)
    .catch(err => console.log(err));
  document.getElementById('msg').value = '';
}

const fetchUsers = () => {
  fetch('/users')
    .then(response => response.json())
    .then(json => {
      document.getElementById('userList').innerHTML = json.userList[0] ? json.userList.join('<br>') : 'No user';
    });
}

const leaveChat = () => {
  source.close();
  document.cookie = `user=`;
  document.getElementById('userList').innerHTML = '';
  document.getElementById('chat').innerHTML = '';
}

const enterChat = () => {  
  document.cookie = `user=${chatUser}`;
  source = new EventSource('/register');
  source.onerror = (error) => {
    console.error('EventSource failed', error);
  };
  
  source.addEventListener('info', (event) => {
    const chat = document.getElementById('chat');
    const message = `<span>${event.data}</span><br>`
    chat.innerHTML += message;
  }, false);
  
  source.addEventListener('oper', (event) => {
    fetchUsers();
  }, false);
}
