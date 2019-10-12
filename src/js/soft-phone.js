import JsSIP from 'jssip';
import remove from 'lodash/remove';
import each from 'lodash/each';
import callCenterMp3 from '../assets/sounds/callcenter.mp3';

class SoftPhone {
    constructor() {
        this.events = {
            muted: [],
            unmuted: [],
            hold: [],
            unhold: [],
            registered: [],
            unregistered: [],
            registrationFailed: [],
            sessionFailed: [],
            sessionProcess: [],
            sessionConfirmed: [],
            sessionEnded: [],
            sessionAccepted: [],
            callProcess: [],
            callConfirmed: [],
            callFailed: [],
            callEnded: []
        };
    }

    init({host, port, username, password}) {
        this._audioElement = document.createElement('audio');
        this._audioElement.autoplay = true;

        if (!__PRODUCTION__) {
            JsSIP.debug.enable('JsSIP:*');
        }

        let websocketUrl = 'wss://' + host + ':' + port;
        this._socket = new JsSIP.WebSocketInterface(websocketUrl);
        this._sipUri = 'sip:' + username + '@' + host;

        this._uaConfig = {
            sockets: [this._socket],
            uri: this._sipUri,
            password: password
        };

        this._ua = new JsSIP.UA(this._uaConfig);

        this._ua.addListener('connecting', this._onUaConnecting.bind(this));
        this._ua.addListener('connected', this._onUaConnected.bind(this));
        this._ua.addListener('disconnected', this._onUaDisconnected.bind(this));
        this._ua.addListener('registered', this._onUaRegistered.bind(this));
        this._ua.addListener('unregistered', this._onUaUnregistered.bind(this));
        this._ua.addListener('registrationFailed', this._onUaRegistrationFailed.bind(this));
        this._ua.addListener('newRTCSession', this._onUaNewRTCSession.bind(this));
    }

    on(eventName, callback) {
        if (eventName in this.events) {
            this.events[eventName].push(callback);
        }
    }

    off(eventName, callback) {
        if (!callback) {
            this.events[eventName] = [];
        } else {
            remove(this.events[eventName], (i) => i === callback);
        }
    }

    trigger(eventName, ...args) {
        if (eventName in this.events) {
            each(this.events[eventName], (i) => {
                i(...args);
            });
        }
    }

    isRegistered() {
        return this._ua.isRegistered();
    }

    isConnected() {
        return this._ua.isConnected();
    }

    register() {
        this._ua.register();
    }

    unregister() {
        let options = {
            all: true
        };

        this._ua.unregister(options);
    }

    start() {
        if (!this._ua) {
            return;
        }
        this._ua.start();
    }

    stop() {
        if (!this._ua) {
            return;
        }
        this._ua.stop();
    }

    call(target) {
        let self = this;
        let options = {
            'eventHandlers': {
                progress: this._onCallProcess.bind(this),
                failed: function({cause}) {
                    self.trigger('callFailed', cause);
                    self._onCallFailed(...arguments);
                },
                confirmed: this._onCallConfirmed.bind(this),
                ended: this._onCallEnded.bind(this)
            },
            'mediaConstraints': {'audio': true, 'video': false},
            sessionTimersExpires: 180
        };

        this._session = this._ua.call(target, options);
    }

    _onCallProcess() {
        console.log('正在拨打');
        this.trigger('callProcess');
    }

    _onCallFailed({cause}) {
        if (cause === 'Canceled') {
            console.log('您取消了');
        } else {
            console.log('拨号失败:' + cause);
        }
    }

    _onCallConfirmed() {
        console.log('对方已接受');
        this.trigger('callConfirmed');
    }

    _onCallEnded() {
        console.log('结束呼叫');
        this.trigger('callEnded');
    }

    _onUaConnecting() {
        // document.getElementById('connect-state').innerText = '正在连接....';
        console.log('正在连接...');
    }

    _onUaConnected() {
        // document.getElementById('connect-state').innerText = '已连接';
        console.log('已连接');
    }

    _onUaDisconnected(e) {
        // document.getElementById('connect-state').innerText = '已断开连接';
        console.log('已断开连接');
        if (e) {
            let {error} = e;
            console.error(error);
        }
    }

    _onUaRegistered({response}) {
        // document.getElementById('register-state').innerText = '已注册';
        // common.tips.info('已注册');
        console.log('已注册');
        this.trigger('registered', response);
    }

    _onUaUnregistered({response, cause}) {
        // document.getElementById('register-state').innerText = '未注册';
        // common.tips.info('已注销');
        console.log('已注销');
        this.trigger('unregistered', {response, cause});
    }

    _onUaRegistrationFailed({response, cause}) {
        // document.getElementById('register-state').innerText = '注册失败';
        console.error(cause);
        this.trigger('registrationFailed', {response, cause});
    }

    _onUaNewRTCSession({session}) {
        this._session = session;
        session.addListener('muted', () => this.trigger('muted'));
        session.addListener('unmuted', () => this.trigger('unmuted'));
        session.addListener('hold', () => this.trigger('hold'));
        session.addListener('unhold', () => this.trigger('unhold'));

        session.on('progress', ({originator}) => {
            if (originator === 'local') {  //呼入时播放振铃声音
                this.playRinging();
            }
            this.trigger('sessionProcess', originator);
        });

        session.on('accepted', () => {
            this.trigger('sessionAccepted');
        });

        session.on('confirmed', () => {
            this._audioElement.srcObject = session.connection.getRemoteStreams()[0];
            this.stopRinging();
            this.trigger('sessionConfirmed');
        });

        session.on('ended', () => {
            this.trigger('sessionEnded');
        });

        session.on('failed', ({cause}) => {
            // unable to establish the call
            this.stopRinging();
            this.trigger('sessionFailed', cause);
        });

        session.on('icecandidate', ({ready}) => {
            if (!this._iceCheckingTimer) {
                this._iceCheckingTimer = setTimeout(ready, 5000);
            }
        });

        session.on('sdp', () => {
            clearTimeout(this._iceCheckingTimer);
            this._iceCheckingTimer = null;
        });

        if (session.direction !== 'incoming') {
            let connection = session.connection;
            connection.addEventListener('addstream', (e) => {
                this._audioElement.srcObject = e.stream;
            });
        }
    }

    _isInProgress() {
    }

    _isEstablished() {
    }

    _isEnded() {
    }

    _isReadyToReOffer() {
    }

    answer() {
        if (this._session && this._session.isInProgress()) {
            this._session.answer({
                mediaConstraints: {'audio': true, 'video': false},
                sessionTimersExpires: 200
            });
        }
    }

    hangupAllSessions() {
        this._ua.terminateSessions();
    }

    _sendDTMF() {
    }

    _sendInfo() {
    }

    hold() {
        this._session.hold();
    }

    unhold() {
        this._session.unhold();
    }

    _renegotiate() {
    }

    _isOnHold() {
    }

    mute() {
        if (this._session) {
            this._session.mute({
                audio: true,
                video: true
            });
        }
    }

    unmute() {
        if (this._session) {
            this._session.unmute({
                audio: true,
                video: false
            });
        }
    }

    playRinging() {
        if (!this._ringingElement) {
            this._ringingElement = document.createElement('audio');
            this._ringingElement.src = callCenterMp3;
            this._ringingElement.loop = true;
        }
        this._ringingElement.play();
    }

    stopRinging() {
        if (this._ringingElement) {
            this._ringingElement.pause();
            this._ringingElement.currentTime = 0;
        }
    }

    _isMuted() {
    }

    _refer() {
    }

    _resetLocalMedia() {
    }
}

export default window.softphone = new SoftPhone();
