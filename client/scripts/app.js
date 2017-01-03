var app = {
  init: function() {
    this.fetch();
    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick(event);
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
      contentType: 'application/json',
      success: function (data) {
        data.results.forEach(function(message) {
          app.renderMessage(message);
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
    $('#roomSelect').append('<li>' + roomName + '</li>');
  }, 
  renderMessage: function(data) {
    $('#chats').append($('<li class=message> <span class=username>' + data.username + ' ' + '</span>' + data.text + '</li>'));
  },
  handleUsernameClick: function(event) {
    console.log('Clicked username');
  },
  handleSubmit: function(message) {
    console.log(message);
  }
};