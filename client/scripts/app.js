var app = {
  rooms: {},
  currentRoom: 'lobby',
  friends: {},
  init: function() {
    this.fetch({order: '-createdAt'});
    
    setInterval(app.fetch.bind(this, {order: '-createdAt', 
                where: {'roomname': app.currentRoom}}), 10000);
    
    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
    });

    $('#send').on('submit', function(event) {
      event.preventDefault();
      app.handleSubmit($('input:first').val());
    });

    $('.re-render').on('click', function(event) {
      app.clearMessages();
      app.fetch();
    });

    $('#roomSelect').on('click', function(event) {
      app.currentRoom = event.target.text;
      app.clearMessages();
      app.fetch({order: '-createdAt', 
                where: {'roomname': app.currentRoom}});
    });

    $('.new-room').on('click', function(event) {
      var newroom = _.escape(prompt('Enter new room name.'));
      app.rooms[newroom] = newroom;
      app.renderRoom(newroom);
    });

    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
      app.clearMessages();
      app.fetch({order: '-createdAt'});
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
        app.fetch({order: '-createdAt'});
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function(optionsObj) {

    //$.ajax(optionsObj)
    $.ajax({
      url: this.server,
      type: 'GET',
      data: optionsObj,
      // data: {
      //   order: '-createdAt',
      //   where: {'roomname': app.currentRoom}        
      // },
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        data.results.forEach(function(message) {
          if (!app.rooms[message.roomname] && !!message.roomname) {
            app.rooms[message.roomname] = message.roomname;
            app.renderRoom(message.roomname);
          }
          if (message.roomname === app.currentRoom) {
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
    // $('#chats').children().remove();
  },
  renderRoom: function(roomName) {
    $('#roomSelect').append('<div><a href ="#">' + roomName + '</a></div>');
  },
 
  renderMessage: function(data) {
    try { 
      var text = encoda.attribute.escape(data.text);
      if (app.friends.hasOwnProperty(data.username)) {
        $('.msgTable').append($('<tr class=message style="font-weight: bold"> <td class=username>' + data.username + '</td><td class=msgText>' + text + '</td></tr>'));   
      } else {
        $('.msgTable').append($('<tr class=message> <td class=username>' + data.username + '</td><td class=msgText>' + text + '</td></tr>'));
      }
    } catch (exception) {
      console.log(exception);
    }
  },
  handleUsernameClick: function(event) {
    app.friends[event.target.textContent] = event.target.textContent;
  },
  handleSubmit: function(message) {
    this.clearMessages();
    this.send({
      username: window.location.search.split('=')[1],
      text: message,
      roomname: app.currentRoom
    });
  }
};