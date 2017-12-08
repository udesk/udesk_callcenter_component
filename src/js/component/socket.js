var io = require('socket.io-client');

class Socket {
    constructor(url, userId, seatToken) {
        this.callbackList = [];
        this.exceptionCallBacks = [];
        var self = this;
        var socket = this.socket = io(url, {transports: ['websocket'], upgrade: false});

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
    }

    onNotice(callback) {
        this.callbackList.push(callback);
    }

    onException(callback) {
        this.exceptionCallBacks.push(callback);
    }

    close(){
        this.socket.close();
    }
}

export default Socket;

