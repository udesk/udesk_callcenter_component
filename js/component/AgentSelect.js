var images = require('./images');
var AjaxUtils = require('./AjaxUtils');
var DEFAULT_CONTENT = '-请选择其他客服-';
import Alert from './Alert';

var doc = document;
var AgentSelect = function() {
    this.maxPage = 1;
    this.page = 1;

    this.element = doc.createElement('div');
    this.selectElement = doc.createElement('div');
    this.dropdownElement = doc.createElement('ul');
    this.selectedContent = doc.createElement('span');
    this.caretDown = doc.createElement('img');

    this.selectedContent.innerText = DEFAULT_CONTENT;
    this.caretDown.src = images.caret_down;

    this.element.className = 'agent-select';
    this.selectElement.className = 'display-frame';
    this.dropdownElement.className = 'dropdown';

    this.element.appendChild(this.selectElement);
    this.element.appendChild(this.dropdownElement);
    this.selectElement.appendChild(this.selectedContent);
    this.selectElement.appendChild(this.caretDown);

    var self = this;
    this.selectElement.onclick = function() {
        if (self.dropdownElement.style.display === 'none') {
            self.openDropdown();
        } else {
            self.closeDropdown();
        }
    };

    this.dropdownElement.onscroll = function() {
        if (this.scrollTop === this.clientHeight) {
            self.page++;
            self.fetchData();
        }
    };

    document.onclick = function(e) {
        self.closeDropdown();
    };

    this.element.onclick = function(e) {
        e.stopPropagation();
    };
};

AgentSelect.prototype.setAgents = function(agents) {
    var self = this;
    for (var i = 0, len = agents.length; i < len; i++) {
        var li = doc.createElement('li');
        li.innerText = agents[i].nick_name;
        this.dropdownElement.appendChild(li);

        li.agentData = agents[i];
        li.onclick = function() {
            self.onSelected && self.onSelected(this.agentData);
            self.closeDropdown();
            self.selectedContent.innerText = this.agentData.nick_name;
        }
    }
};

AgentSelect.prototype.closeDropdown = function() {
    this.dropdownElement.style.display = 'none';
};

AgentSelect.prototype.openDropdown = function() {
    this.dropdownElement.style.display = 'block';
    this.fetchData();
};

AgentSelect.prototype.fetchData = function() {
    var self = this;
    this.appendLoading();
    AjaxUtils.get('/agent_api/v1/agents', { page: this.page }, function(res) {
        self.setAgents(res.agents);
        self.maxPage = res.meta.page_count;
        self.page = res.meta.current_page;
        self.removeLoading();
    }, function() {
        Alert.error('获取客服失败！');
        self.removeLoading();
    });
};

AgentSelect.prototype.clear = function() {
    this.selectedContent.innerText = DEFAULT_CONTENT;
};

AgentSelect.prototype.appendLoading = function() {
    if (this.dropdownElement.lastElementChild === this.liEle) {
        return;
    }
    this.liEle = document.createElement('li');
    this.liEle.style.textAlign = 'center';
    this.liEle.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    this.dropdownElement.appendChild(this.liEle);
};

AgentSelect.prototype.removeLoading = function() {
    try {
        this.dropdownElement.removeChild(this.liEle);
    } catch (e) {}
};

AgentSelect.prototype.clearValue = function() {
    this.selectedContent.innerText = '';
};

module.exports = AgentSelect;