var io = require('socket.io-client');

var fun = function(url, userId, seatToken) {
    this.callbackList = [];
    this.exceptionCallBacks = [];
    var self = this;
    var socket = io(url, {transports: ['websocket'], upgrade: false});

    var config = {
        token: seatToken,
        uid: userId,
        clientId: new Date().getTime() + Math.random() + ''
    };

    socket.emit('register', config);

    socket.on('reconnect', function() {
        socket.emit('register', config);
    });

    socket.on('notice', function(data) {
        for (var i = 0, len = self.callbackList.length; i < len; i++) {
            self.callbackList[i].call(self, data);
        }
    });

    socket.on('exception', function(data) {
        for (var i = 0, len = self.exceptionCallBacks.length; i < len; i++) {
            self.exceptionCallBacks[i].call(self, data);
        }
    });
};

fun.prototype.onNotice = function(callback) {
    this.callbackList.push(callback);
};

fun.prototype.onException = function(callback) {
    this.exceptionCallBacks.push(callback);
};

module.exports = fun;

