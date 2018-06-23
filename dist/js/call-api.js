/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _AjaxUtils = __webpack_require__(1);
	
	var _AjaxUtils2 = _interopRequireDefault(_AjaxUtils);
	
	var _Alert = __webpack_require__(3);
	
	var _Alert2 = _interopRequireDefault(_Alert);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var emptyFunction = function emptyFunction() {};
	
	var CallAPI = function () {
	    function CallAPI() {
	        _classCallCheck(this, CallAPI);
	    }
	
	    CallAPI.prototype.tokenInit = function tokenInit(token, subDomain, onTokenExpired) {
	        _AjaxUtils2["default"].token = token;
	        _AjaxUtils2["default"].host = ("http") + '://' + subDomain + (".cebbank.com:8080");
	        _AjaxUtils2["default"].refreshToken = onTokenExpired;
	    };
	
	    CallAPI.prototype._updateAgentWorkState = function _updateAgentWorkState(agent_no, workStatus, cc_custom_state_id) {
	        var successCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;
	        var failureCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : emptyFunction;
	
	        var params = {};
	        if (cc_custom_state_id !== undefined) {
	            params.cc_custom_state_id = cc_custom_state_id;
	        }
	        params.agent_work_state = workStatus;
	        params.agent_no = agent_no;
	
	        _AjaxUtils2["default"].post('/agent_api/v1/callcenter/agents/update_agent_work_state', params, function (res) {
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
	    };
	
	    CallAPI.prototype.setMonitorWorkStatus = function setMonitorWorkStatus(agent_no, workStatus) {
	        var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	        var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;
	
	        this._updateAgentWorkState(agent_no, workStatus, undefined, successCallback, failureCallback);
	    };
	
	    CallAPI.prototype.setMonitorWorkRestingStatus = function setMonitorWorkRestingStatus(agent_no, cc_custom_state_id) {
	        var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	        var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;
	
	        this._updateAgentWorkState(agent_no, 'resting', cc_custom_state_id, successCallback, failureCallback);
	    };
	
	    CallAPI.prototype.setMonitorAgentWorkWay = function setMonitorAgentWorkWay(agent_no, agent_work_way) {
	        var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	        var failureCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyFunction;
	
	        _AjaxUtils2["default"].post('/agent_api/v1/callcenter/agents/update_agent_work_way', { agent_no: agent_no, agent_work_way: agent_work_way }, function (res) {
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
	    };
	
	    CallAPI.prototype.monitorAgentListeing = function monitorAgentListeing(agent_no) {
	        var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
	        var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	
	        _AjaxUtils2["default"].post('/agent_api/v1/callcenter/desktop/listeing', { agent_no: agent_no }, function (res) {
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
	    };
	
	    CallAPI.prototype.monitorAgentInterpose = function monitorAgentInterpose(agent_no) {
	        var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
	        var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	
	        _AjaxUtils2["default"].post('/agent_api/v1/callcenter/desktop/interpose', { agent_no: agent_no }, function (res) {
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
	    };
	
	    CallAPI.prototype.monitorAgentSubstitute = function monitorAgentSubstitute(agent_no) {
	        var successCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyFunction;
	        var failureCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;
	
	        _AjaxUtils2["default"].post('/agent_api/v1/callcenter/desktop/substitute', { agent_no: agent_no }, function (res) {
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
	    };
	
	    return CallAPI;
	}();
	
	window.callAPI = new CallAPI();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Base = __webpack_require__(2);
	
	var _Base2 = _interopRequireDefault(_Base);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
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
	        }
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
	                var _content = xhr.response || xhr.responseText;
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
	
	        if (xhr.readyState === 4) {
	            var contentType = xhr.getResponseHeader('Content-Type');
	            if (contentType === 'application/javascript') {
	                successCallback && successCallback(eval(xhr.response || xhr.responseText), xhr);
	            } else if (contentType.indexOf('application/json') > -1) {
	                successCallback && successCallback(JSON.parse(xhr.response || xhr.responseText), xhr);
	            } else {
	                successCallback && successCallback(xhr.response || xhr.responseText, xhr);
	            }
	        }
	    }
	
	    xhr.open(method, obj.host + url, true);
	    if (headers) {
	        for (var i in headers) {
	            xhr.setRequestHeader(i, headers[i]);
	        }
	    }
	    xhr.setRequestHeader('Authorization', 'Basic ' + _Base2["default"].btoa('agent:' + obj.token));
	
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
	    "delete": del,
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	;(function () {
	
	  var object =
	     true ? exports :
	    typeof self != 'undefined' ? self : // #8: web workers
	    $.global; // #31: ExtendScript
	
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	  function InvalidCharacterError(message) {
	    this.message = message;
	  }
	  InvalidCharacterError.prototype = new Error;
	  InvalidCharacterError.prototype.name = 'InvalidCharacterError';
	
	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  object.btoa || (
	  object.btoa = function (input) {
	    var str = String(input);
	    for (
	      // initialize result and counter
	      var block, charCode, idx = 0, map = chars, output = '';
	      // if the next str index does not exist:
	      //   change the mapping table to "="
	      //   check if d has no fractional digits
	      str.charAt(idx | 0) || (map = '=', idx % 1);
	      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	    ) {
	      charCode = str.charCodeAt(idx += 3/4);
	      if (charCode > 0xFF) {
	        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
	      }
	      block = block << 8 | charCode;
	    }
	    return output;
	  });
	
	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  object.atob || (
	  object.atob = function (input) {
	    var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
	    if (str.length % 4 == 1) {
	      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	      // initialize result and counters
	      var bc = 0, bs, buffer, idx = 0, output = '';
	      // get next character
	      buffer = str.charAt(idx++);
	      // character found in table? initialize bit storage and add its ascii value;
	      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	        // and if not first of each 4 characters,
	        // convert the first 8 bits to one ascii character
	        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	    ) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  });
	
	}());


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var doc = document;
	
	var Alert = function () {
	    function Alert() {
	        _classCallCheck(this, Alert);
	    }
	
	    Alert.prototype.createElement = function createElement() {
	        var id = 'udesk-callcenter-component-alert';
	        var element = this.element = doc.getElementById(id);
	        var body = doc.body;
	
	        if (!element) {
	            element = this.element = doc.createElement('div');
	            element.id = id;
	
	            body.appendChild(element);
	        }
	    };
	
	    Alert.prototype.success = function success(text) {
	        this.createElement();
	        this.element.innerText = text;
	        this.element.style.backgroundColor = 'green';
	        this.show();
	    };
	
	    Alert.prototype.error = function error(text) {
	        this.createElement();
	        this.element.innerText = text;
	        this.element.style.backgroundColor = 'red';
	        this.show();
	    };
	
	    Alert.prototype.destroy = function destroy() {
	        if (this.element && this.element.parentNode) {
	            this.element.parentNode.removeChild(this.element);
	        }
	    };
	
	    Alert.prototype.show = function show() {
	        var _this = this;
	
	        this.element.style.display = 'block';
	        clearTimeout(this.timeoutId);
	        this.timeoutId = setTimeout(function () {
	            _this.element && (_this.element.style.display = 'none');
	        }, 5000);
	    };
	
	    return Alert;
	}();
	
	exports["default"] = new Alert();

/***/ })
/******/ ]);
//# sourceMappingURL=call-api.js.map