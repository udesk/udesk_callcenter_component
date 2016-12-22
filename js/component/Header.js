var doc = document;
var images = require('./images');

var Header = function() {
    this.open = false;

    this.element = doc.createElement('div');
    var eleStyle = this.element.style;
    eleStyle.height = eleStyle.lineHeight = '34px';
    eleStyle.paddingLeft = '11px';
    eleStyle.paddingRight = '11px';

    this.title = doc.createElement('div');
    var titleStyle = this.title.style;
    this.title.innerText = '电话';
    titleStyle.color = '#fff';
    titleStyle.width = '50%';
    titleStyle.height = '100%';

    this.toggleBtn = doc.createElement('div');
    var toggleBtnStyle = this.toggleBtn.style;
    toggleBtnStyle.height = '12px';
    toggleBtnStyle.float = 'right';
    toggleBtnStyle.height = '100%';

    this.toggleBtnImg = doc.createElement('img');
    this.toggleBtnImg.src = images.minimize;
    this.toggleBtn.appendChild(this.toggleBtnImg);

    this.element.appendChild(this.toggleBtn);
    this.element.appendChild(this.title);

    this.element.style.backgroundColor = "#333";
};

module.exports = Header;