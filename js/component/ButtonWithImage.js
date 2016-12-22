var doc = document;
var ImageTextButton = function(imageURL, text) {
    this.text = text;
    this.image = doc.createElement('img');
    this.image.src = imageURL;
    this.image.style.width = this.image.style.height = '20px';
    this.image.style.verticalAlign = 'middle';

    this.element = doc.createElement('button');
    this.element.appendChild(this.image);
    this.textEle = doc.createElement('span');
    this.textEle.innerText = text;
    this.element.appendChild(this.textEle);
    this.element.style.border = '1px solid #ccc';
    this.element.style.backgroundColor = '#fff';
    this.element.style.padding = '5px';
    this.element.style.borderRightWidth = '0';
    this.element.style.outline = 'none';

    this.state = 'normal';

    var self = this;
    this.element.onclick = function() {
        if (self.state === 'normal') {
            self.normalHandler && self.normalHandler(self);
        } else {
            self.cancelHandler && self.cancelHandler(self);
        }
    };
};

ImageTextButton.prototype.toCancelState = function() {
    this.textEle.innerText = '取消';
    this.state = 'cancel';
};

ImageTextButton.prototype.toNormalState = function() {
    this.textEle.innerText = this.text;
    this.state = 'normal';
};

module.exports = ImageTextButton;