var app = {
  init: function() {
    window.rooms = {};
    window.currentRoom = 'lobby';
    window.friends = [];
    this.fetch();
    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
    });

    $('#send').on('submit', function(event) {
      event.preventDefault();
      // console.log($('#message'));
      app.handleSubmit($('input:first').val());
      console.log($('input:first').val());
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

    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
      console.log('31');
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
        //app.clearMessages();
        app.fetch();
        //app.renderAll(data);
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
    // }
  },
 
  renderMessage: function(data) {
    // first check if each roomname matches any in the options array
    //
    var text = _.escape(data.text);
    $('#chats').append($('<li class=message> <span class=username>' + data.username + ' ' + '</span>' + text + '</li>'));
  },
  handleUsernameClick: function(event) {
    window.friends.push(event.target.text);
    //loop thru messages from friends
    //make messages boldface font

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