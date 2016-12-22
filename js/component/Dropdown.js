var images = require('./images');

var doc = document;
var DropdownBtn = function(opt) {
    var content = opt.content;
    var dropdownPlace = opt.dropdownPlace || 'left';

    var self = this;
    this.direction = 'up';
    this.open = false;
    this.element = doc.createElement('div');
    this.element.className = 'ucm-dropdown';
    this.element.style.position = 'relative';
    this.element.style.fontSize = '14px';

    this.content = content || [
            { id: '0', name: '' }
        ];

    this.toggleBtn = doc.createElement('img');
    this.toggleBtn.src = images.caret_down;
    this.toggleBtn.style.float = 'right';
    this.toggleBtn.style.marginTop = '4px';
    this.toggleBtn.style.cursor = 'pointer';

    this.dropdown = doc.createElement('ul');
    for (var i = 0; i < this.content.length; i++) {
        var itemElement = doc.createElement('li');
        itemElement.setAttribute('data-id', this.content[i].id);
        if (typeof this.content[i].name === 'string') {
            itemElement.innerText = this.content[i].name;
        } else if (typeof this.content[i].name === 'function') {
            itemElement.appendChild(this.content[i].name());
        }
        this.dropdown.appendChild(itemElement);
        itemElement.addEventListener('click', function() {
            self.onDropdownItemClick && self.onDropdownItemClick(self, this);
        });
    }
    var dropdownStyle = this.dropdown.style;

    this.selectedElement = doc.createElement('div');
    this.selectedElement.innerHTML = this.dropdown.children[0].innerHTML;
    this.selectedElement.style.cursor = 'pointer';

    this.element.appendChild(this.toggleBtn);
    this.element.appendChild(this.selectedElement);
    this.element.appendChild(this.dropdown);

    var dropdownEle = this.dropdown;
    this.element.addEventListener('click', function() {
        if (self.direction === 'up') {
            dropdownEle.style.bottom = '100%';
            dropdownEle.style.top = 'auto';
        } else {
            dropdownEle.style.top = '100%';
            dropdownEle.style.bottom = 'auto';
        }
        var dropdownHidden = getComputedStyle(dropdownEle).display === 'none';
        dropdownEle.style.display = dropdownHidden ? 'block' : 'none';
    });
    doc.addEventListener('click', function(e) {
        for (var i = e.srcElement; i && i.parentNode !== doc; i = i.parentNode) {
            if (i === self.element) {
                return;
            }
        }
        self.closeDropdown();
    });
};
DropdownBtn.prototype.setValue = function(value, afterSetCallback) {
    if (this.value === value) {
        return;
    }
    this.value = value;
    this.updateUIByValue(value);
    if (afterSetCallback && (typeof afterSetCallback === 'function')) {
        afterSetCallback(value);
    }
    return this.selectedItem;
};
DropdownBtn.prototype.updateUIByValue = function(value) {
    this.selectedItem = this.content.find(function(item) {
        return item.id === value;
    });
    if ((typeof this.selectedItem.name) === 'function') {
        this.selectedElement.innerHTML = '';
        this.selectedElement.appendChild(this.selectedItem.name());
    } else {
        this.selectedElement.innerText = this.selectedItem.name;
    }
};

DropdownBtn.prototype.closeDropdown = function() {
    this.dropdown.style.display = 'none';
};

module.exports = DropdownBtn;