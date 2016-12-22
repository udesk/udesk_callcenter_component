var doc = document;
var KeyBtn = function(number, numberInput) {
    this.element = doc.createElement('button');
    this.element.innerText = number;
    this.element.style.outline = 'none';
    this.element.style.width = '94%';
    this.element.style.height = '47px';
    this.element.style.border = '1px solid #e4e4e4';
    this.element.style.background = '#eee';
    this.element.style.marginBottom = '7px';
    this.element.style.fontSize = '16px';
    this.element.style.color = '#666';
    this.element.style.cursor = 'pointer';
    this.element.onclick = function() {
        numberInput.setValue(numberInput.getValue() + number);
    }
};

module.exports = KeyBtn;