var KeyBtn = require('./KeyButton.js');

var doc = document;
var Keyboard = function(numberInput) {
    this.element = doc.createElement('div');
    this.element.style.display = 'none';

    var left = doc.createElement('div');
    var middle = doc.createElement('div');
    var right = doc.createElement('div');

    left.style.float = middle.style.float = right.style.float = 'left';
    left.style.width = middle.style.width = right.style.width = '33.333333333%';
    left.style.textAlign = 'left';
    middle.style.textAlign = 'center';
    right.style.textAlign = 'right';

    left.appendChild(new KeyBtn(1, numberInput).element);
    left.appendChild(new KeyBtn(4, numberInput).element);
    left.appendChild(new KeyBtn(7, numberInput).element);
    left.appendChild(new KeyBtn('*', numberInput).element);

    middle.appendChild(new KeyBtn(2, numberInput).element);
    middle.appendChild(new KeyBtn(5, numberInput).element);
    middle.appendChild(new KeyBtn(8, numberInput).element);
    middle.appendChild(new KeyBtn(0, numberInput).element);

    right.appendChild(new KeyBtn(3, numberInput).element);
    right.appendChild(new KeyBtn(6, numberInput).element);
    right.appendChild(new KeyBtn(9, numberInput).element);
    right.appendChild(new KeyBtn('#', numberInput).element);

    this.element.appendChild(left);
    this.element.appendChild(middle);
    this.element.appendChild(right);

    var clearfix = doc.createElement('div');
    clearfix.style.clear = 'both';
    this.element.appendChild(clearfix);
};

Keyboard.prototype.toggleVisible = function() {
    if (this.element.style.display === 'none') {
        this.element.style.display = 'block';
    } else {
        this.element.style.display = 'none';
    }
};

module.exports = Keyboard;