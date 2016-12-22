var images = require('./images');

var doc = document;
var CallBtn = function(type) {
    this.element = doc.createElement('button');
    this.element.style.width = '100%';
    this.element.style.backgroundColor = '#49b34f';
    this.element.style.border = '0';
    this.element.style.height = '47px';

    this.img = doc.createElement('img');
    this.img.src = images.call_out;
    if (type === 'hangup') {
        this.img.src = images.hangup;
    }

    this.element.appendChild(this.img);
};

module.exports = CallBtn;