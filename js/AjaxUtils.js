function getXMLHttpRequest() {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        var versions = ["MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ]

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            }
            catch (e) {}
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
        successCallback: function(content, xhr) {
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
        successCallback: function(content, xhr) {
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
        successCallback: function(content, xhr) {
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
    })
}

function del(url, params, callback, failureCallback) {
    load({
        method: 'DELETE',
        url: url,
        content: JSON.stringify(params),
        successCallback: function(content, xhr) {
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
    host: ''
};

module.exports = obj;

function serializeParams(params) {
    var content = [];

    for (var i in params) {
        content.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
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