var app = {
  init: function() {
    window.rooms = {};
    window.currentRoom = 'lobby';
    window.friends = {};
    this.fetch();
    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
    });

    $('#send').on('submit', function(event) {
      event.preventDefault();
      // console.log($('#message'));
      app.handleSubmit($('input:first').val());
    });

    $('.re-render').on('click', function(event) {
      app.clearMessages();
      app.fetch();
    });

    $('#roomSelect').on('click', function(event) {
      window.currentRoom = event.target.text;
      app.clearMessages();
      app.fetch();
    });

    $('.new-room').on('click', function(event) {
      var newroom = _.escape(prompt('Enter new room name.'));
      window.rooms[newroom] = newroom;
      app.renderRoom(newroom);
    });

    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
      app.clearMessages();
      app.fetch();
    });
    
  },
  server: 'https://api.parse.com/1/classes/messages',
  send: function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        data.results.forEach(function(message) {
          if (!window.rooms[message.roomname] && !!message.roomname) {
            window.rooms[message.roomname] = message.roomname;
            app.renderRoom(message.roomname);
          }
          if (message.roomname === window.currentRoom) {
            app.renderMessage(message);
          }
        });
        console.log('chatterbox: Message is received');
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  renderRoom: function(roomName) {
    $('#roomSelect').append('<div><a href ="#">' + roomName + '</a></div>');
  },
 
  renderMessage: function(data) {
    // first check if each roomname matches any in the options array
    //
    var text = _.escape(data.text);
    if (window.friends.hasOwnProperty(data.username)) {
      $('#chats').append($('<li class=message style="font-weight: bold"> <span class=username>' + data.username + '</span>' + text + '</li>'));   
    } else {
      $('#chats').append($('<li class=message> <span class=username>' + data.username + '</span>' + text + '</li>'));
    }
  },
  handleUsernameClick: function(event) {
    window.friends[event.target.textContent] = event.target.textContent;
  },
  handleSubmit: function(message) {
    this.clearMessages();
    this.send({
      username: window.location.search.split('=')[1],
      text: message,
      roomname: window.currentRoom
    });
  }
};