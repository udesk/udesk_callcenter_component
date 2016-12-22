var images = require('./images');
var doc = document;
var NumberInput = function() {
    this.element = doc.createElement('div');
    this.element.style.height = '36px';
    this.element.style.border = '1px solid #e4e4e4';

    this.keyBtn = doc.createElement('img');
    this.keyBtn.src = images.keyboard;
    this.keyBtn.style.float = 'right';
    this.keyBtn.style.marginTop = '6px';
    this.keyBtn.style.marginRight = '5px';
    this.keyBtn.style.cursor = 'pointer';

    this.input = doc.createElement('input');
    this.input.placeholder = '输入号码';
    this.input.style.border = '0';
    this.input.style.width = '100%';
    this.input.style.height = '100%';
    this.input.style.outline = 'none';
    this.input.style.fontSize = '16px';
    this.input.style.padding = '0';
    this.input.style.paddingLeft = '5px';
    this.input.style.boxSizing = 'border-box';
    this.input.style.mozBoxSizing = 'border-box';
    this.input.style.webkitBoxSizing = 'border-box';

    var inputWrapper = doc.createElement('div');
    inputWrapper.style.marginRight = '30px';
    inputWrapper.style.height = '100%';
    //inputWrapper.style.paddingLeft = '5px';

    inputWrapper.appendChild(this.input);
    this.element.appendChild(this.keyBtn);
    this.element.appendChild(inputWrapper);

    this.getValue = function() {
        return this.input.value;
    };

    this.setValue = function(value) {
        return this.input.value = value
    };

    var self = this;
    this.keyBtn.onclick = function() {
        if (self.onKeyBtnClick) {
            self.onKeyBtnClick.apply(self, arguments);
        }
    }
};

module.exports = NumberInput;