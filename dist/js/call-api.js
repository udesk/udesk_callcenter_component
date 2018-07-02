/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 152);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var doc = document;

var Alert = function () {
    function Alert() {
        _classCallCheck(this, Alert);
    }

    _createClass(Alert, [{
        key: 'createElement',
        value: function createElement() {
            var id = 'udesk-callcenter-component-alert';
            var element = this.element = doc.getElementById(id);
            var body = doc.body;

            if (!element) {
                element = this.element = doc.createElement('div');
                element.id = id;

                body.appendChild(element);
            }
        }
    }, {
        key: 'success',
        value: function success(text) {
            this.createElement();
            this.element.innerText = text;
            this.element.style.backgroundColor = 'green';
            this.show();
        }
    }, {
        key: 'error',
        value: function error(text) {
            this.createElement();
            this.element.innerText = text;
            this.element.style.backgroundColor = 'red';
            this.show();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }, {
        key: 'show',
        value: function show() {
            var _this = this;

            this.element.style.display = 'block';
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(function () {
                _this.element && (_this.element.style.display = 'none');
            }, 5000);
        }
    }]);

    return Alert;
}();

exports.default = new Alert();

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import utils from './Tools';


var _AjaxUtils = __webpack_require__(28);

var _AjaxUtils2 = _interopRequireDefault(_AjaxUtils);

var _Alert = __webpack_require__(12);

var _Alert2 = _interopRequireDefault(_Alert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var emptyFunction = function emptyFunction() {};

var CallAPI = function () {
    function CallAPI() {
        _classCallCheck(this, CallAPI);
    }

    _createClass(CallAPI, [{
        key: 'tokenInit',
        value: function tokenInit(token, subDomain, onTokenExpired) {
            _AjaxUtils2.default.token = token;
            _AjaxUtils2.default.host = 'https' + '://' + subDomain + '.udesktiger.com';
            _AjaxUtils2.default.refreshToken = onTokenExpired;
        }
    }, {
        key: '_updateAgentWorkState',
        value: function _updateAgentWorkState(agent_no, workStatus, cc_custom_state_id) {
            var successCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;
            var failureCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : emptyFunction;

            var params = {};
            if (cc_custom_state_id !== undefined) {
                params.cc_custom_state_id = cc_custom_state_id;
            }
            params.agent_work_state = workStatus;
            params.agent_no = agent_no;

            _AjaxUtils2.default.post('/agent_api/v1/callcenter/agents/update_agent_work_state', params, function (res) {
                switch (res.code) {
                    case 1000:
                        successCallback(res);
                        break;
                    default:
                        failureCallback(res);
                }
            }, function (res) {
                failureCallback(res);
            });
        }
    }, {
        key: 'setMonitorWorkStatus',
        value: function setMonitorWorkStatus(agent_no, workStatus) {
            var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
            var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;

            this._updateAgentWorkState(agent_no, workStatus, undefined, successCallback, failureCallback);
        }
    }, {
        key: 'setMonitorWorkRestingStatus',
        value: function setMonitorWorkRestingStatus(agent_no, cc_custom_state_id) {
            var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
            var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;

            this._updateAgentWorkState(agent_no, 'resting', cc_custom_state_id, successCallback, failureCallback);
        }
    }, {
        key: 'setMonitorAgentWorkWay',
        value: function setMonitorAgentWorkWay(agent_no, agent_work_way) {
            var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
            var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;

            _AjaxUtils2.default.post('/agent_api/v1/callcenter/agents/update_agent_work_way', { agent_no: agent_no, agent_work_way: agent_work_way }, function (res) {
                switch (res.code) {
                    case 1000:
                        successCallback(res);
                        break;
                    default:
                        failureCallback(res);
                }
            }, function (res) {
                failureCallback(res);
            });
        }
    }, {
        key: 'monitorAgentListeing',
        value: function monitorAgentListeing(agent_no) {
            var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
            var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;

            _AjaxUtils2.default.post('/agent_api/v1/callcenter/desktop/listeing', { agent_no: agent_no }, function (res) {
                switch (res.code) {
                    case 1001:
                        successCallback(res);
                        break;
                    default:
                        failureCallback(res);
                }
            }, function (res) {
                failureCallback(res);
            });
        }
    }, {
        key: 'monitorAgentInterpose',
        value: function monitorAgentInterpose(agent_no) {
            var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
            var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;

            _AjaxUtils2.default.post('/agent_api/v1/callcenter/desktop/interpose', { agent_no: agent_no }, function (res) {
                switch (res.code) {
                    case 1001:
                        successCallback(res);
                        break;
                    default:
                        failureCallback(res);
                }
            }, function (res) {
                failureCallback(res);
            });
        }
    }, {
        key: 'monitorAgentSubstitute',
        value: function monitorAgentSubstitute(agent_no) {
            var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
            var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;

            _AjaxUtils2.default.post('/agent_api/v1/callcenter/desktop/substitute', { agent_no: agent_no }, function (res) {
                switch (res.code) {
                    case 1001:
                        successCallback(res);
                        break;
                    default:
                        failureCallback(res);
                }
            }, function (res) {
                failureCallback(res);
            });
        }
    }]);

    return CallAPI;
}();

window.callAPI = new CallAPI();

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getXMLHttpRequest() {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        var versions = ['MSXML2.XmlHttp.5.0', 'MSXML2.XmlHttp.4.0', 'MSXML2.XmlHttp.3.0', 'MSXML2.XmlHttp.2.0', 'Microsoft.XmlHttp'];

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {}
        } // end for
    }

    return xhr;
}

function load(options) {
    var method = options.method;
    var url = options.url;
    var content = options.content;
    var successCallback = options.successCallback;
    var failureCallback = options.failureCallback;
    var headers = options.headers;
    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
            if (xhr.status === 400) {
                var _content = xhr.response;
                var _contentType = xhr.getResponseHeader('Content-Type');
                if (_contentType.indexOf('application/json') > -1) {
                    _content = JSON.parse(_content);
                    if ((_content.code === 'invalid_password' || _content.code === 'token_expired') && obj.refreshToken && !options.retry) {
                        obj.refreshToken(function (newToken) {
                            options.retry = true;
                            obj.token = newToken;
                            load(options);
                        });
                        return;
                    }
                }
            }
            failureCallback && failureCallback(xhr);
            return;
        }

        // all is well
        if (xhr.readyState === 4) {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (contentType === 'application/javascript') {
                successCallback && successCallback(eval(xhr.response), xhr);
            } else if (contentType.indexOf('application/json') > -1) {
                successCallback && successCallback(JSON.parse(xhr.response), xhr);
            } else {
                successCallback && successCallback(xhr.response, xhr);
            }
        }
    }

    xhr.open(method, obj.host + url, true);
    if (headers) {
        for (var i in headers) {
            xhr.setRequestHeader(i, headers[i]);
        }
    }
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('agent:' + obj.token));

    xhr.send(content);
}

function get(url, params, callback, failureCallback) {
    var content = serializeParams(params);
    if (content) {
        if (url.indexOf('?') === -1) {
            url += '?' + content;
        } else {
            url += '&' + content;
        }
    }
    load({
        method: 'GET',
        url: url,
        successCallback: function successCallback(content, xhr) {
            if (typeof content === 'string') {
                callback && callback(JSON.parse(content), xhr);
            } else {
                callback && callback(content, xhr);
            }
        },
        failureCallback: failureCallback
    });
}

function post(url, params, callback, failureCallback) {
    load({
        method: 'POST',
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        content: serializeParams(params),
        successCallback: callback,
        failureCallback: failureCallback
    });
}

function postJSON(url, params, callback, failureCallback) {
    load({
        method: 'POST',
        url: url,
        content: JSON.stringify(params),
        successCallback: function successCallback(content, xhr) {
            if (typeof content === 'string') {
                callback && callback(JSON.parse(content), xhr);
            } else {
                callback && callback(content, xhr);
            }
        },
        headers: {
            'content-type': 'application/json'
        },
        failureCallback: failureCallback
    });
}

function put(url, params, callback, failureCallback) {
    load({
        method: 'PUT',
        url: url,
        content: JSON.stringify(params),
        successCallback: function successCallback(content, xhr) {
            if (typeof content === 'string') {
                callback && callback(JSON.parse(content), xhr);
            } else {
                callback && callback(content, xhr);
            }
        },
        headers: {
            'content-type': 'application/json'
        },
        failureCallback: failureCallback
    });
}

function del(url, params, callback, failureCallback) {
    load({
        method: 'DELETE',
        url: url,
        content: JSON.stringify(params),
        successCallback: function successCallback(content, xhr) {
            if (typeof content === 'string') {
                callback && callback(JSON.parse(content), xhr);
            } else {
                callback && callback(content, xhr);
            }
        },
        headers: {
            'content-type': 'application/json'
        },
        failureCallback: failureCallback
    });
}

var obj = {
    get: get,
    post: post,
    postJSON: postJSON,
    put: put,
    delete: del,
    token: '',
    host: '',
    refreshToken: null
};

module.exports = obj;

function serializeParams(params) {
    var content = [];

    for (var i in params) {
        content.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }
    content = content.join('&');
    return content;
}

//Ajax测试代码
//get("http://localhost:8080/testGet", function() {
//    console.log('arg', arguments);
//});
//post("http://localhost:8080/testPost", { a: 'bbb', '如果': '那么' }, function() {
//    console.log('arg', arguments);
//});
//
//postJSON('http://localhost:8080/testPostJson', {
//    '名称': '李思', '描述': '大帅哥', '邮箱': ['aaa@qq.com', 'bbb@gmail.com'
//    ]
//}, function() {
//    console.log('args', arguments);
//});
//
//put('http://localhost:8080/testPut', {
//    '年龄': 20, '身高': 189, '其他属性': {
//        '星座': '狮子座', '爱好': ['吃饭', '睡觉', '打豆豆'
//        ]
//    }
//}, function() {
//    console.log('args', arguments);
//});
//
//delete('http://localhost:8080/testDelete', { a: 'b', c: 33, d: true, '888': [1, 2, 3, 4] }, function() {
//    console.log('args', arguments);
//});

/***/ })

/******/ });
//# sourceMappingURL=call-api.js.map