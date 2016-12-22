var doc = document;
var timeoutId;
var Alert = function(text, type) {
    var id = 'udesk-callcenter-component-alert';
    var element = doc.getElementById(id);
    var body = doc.body;

    if (!element) {
        element = doc.createElement('div');
        element.id = id;

        body.append(element);
    }

    element.innerText = text;

    if (type === 'success') {
        element.style.backgroundColor = 'green';
    } else {
        element.style.backgroundColor = 'red';
    }

    element.style.display = 'block';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        element && (element.style.display = 'none');
    }, 5000);
};

module.exports = {
    success: function(text) {
        Alert(text, 'success');
    },
    error: function(text) {
        Alert(text, 'error');
    }
};
