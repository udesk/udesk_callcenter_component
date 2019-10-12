import {map} from 'lodash/map';
import React, {Component} from 'react';
import images from './images';

/**
 * @class
 * @property {string} placeholder - 默认的显示内容
 * @property {string} optionLabelPath - label来自于哪个属性
 * @property {number} maxPage - 最多页数
 * @property {number} page - 当前第几页
 */
export default class BaseSelect extends Component {
    _doNotCloseDropDown = false;

    componentDidMount() {
        this._isMounted = true;
        this.loadMore();
        document.body.addEventListener('click', this._onBodyClick = () => {
            if (this._doNotCloseDropDown) {
                this._doNotCloseDropDown = false;
                return;
            }
            this.setState({expand: false});
        });

        this._ref.addEventListener('click', this._onDropDownMenuClick = () => {
            this._doNotCloseDropDown = true;
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.body.removeEventListener('click', this._onBodyClick);
        this._ref.removeEventListener('click', this._onDropDownMenuClick);
    }

    constructor(props) {
        super(props);
        let {
            optionLabelPath = 'nick_name',
            placeholder = '',
            customOptionDiv = false
        } = props;

        this.maxPage = 1;
        this.page = 1;
        this.state = {
            content: [],
            loading: true,
            expand: false,
            selectedItem: null,
            placeholder,
            optionLabelPath,
            showSearch: false,
            query: ''
        };
    }

    render() {
        let dropdownClass = 'dropdown';
        let {showSearch} = this.props;
        let {loading, query} = this.state;
        if (!this.state.expand) {
            dropdownClass = dropdownClass + ' hide';
        }
        if (showSearch) {
            dropdownClass += ' show-search';
        }

        return <div className="agent-select">
            {(() => {
                if (this.props.mode === 'input_search') {
                    let placeholder = this.state.placeholder;
                    return <div className="external-phone">
                        <input placeholder={placeholder} onChange={(e) => {
                            this.onSearch(e.target.value);
                        }}/>
                    </div>;
                } else {
                    return <div className="display-frame" onClick={this.toggleExpand}>
                        <span>{this.state.selectedItem ? this.state.selectedItem[this.state.optionLabelPath] : this.state.placeholder}</span>
                        <img src={images.caret_down}/>
                    </div>;
                }

            })()}

            <div className={dropdownClass} ref={(dropDownMenu) => this._ref = dropDownMenu}>
                {(() => {
                    if (!this.state.content.length && !this.state.loading) {
                        return <ul>
                            <li style={{textAlign: 'center'}}>
                                未筛选出客服|外部联系人<br/>或<br/>无客服在线<br/>
                            </li>
                            <li style={{textAlign: 'center'}}>
                                <a href='javascript:' onClick={() => this.loadMore(this.state.query)}>刷新</a>
                            </li>
                        </ul>;
                    } else {
                        return <ul onScroll={this.onScroll}>
                            {map(this.state.content, (item) => {
                                let self = this;
                                let onClickFun = function() {
                                    self.props.onChange(item);
                                    self.setState({expand: false, selectedItem: item, search: ''});
                                };
                                if (this.state.customOptionDiv) {
                                    return this.customOptionStructure(item, onClickFun);
                                } else {
                                    return <li key={item.id} onClick={onClickFun}>{item[this.state.optionLabelPath]}</li>;
                                }
                            })}
                            {(() => {
                                if (loading) {
                                    return <li className="text-center"><i className="fa fa-spinner fa-spin"/></li>;
                                }
                            })()}
                        </ul>;
                    }
                })()}
                {(() => {
                    if (showSearch) {
                        return <div><input placeholder='搜索' value={query}
                                           onChange={this._onQueryInputChange}/></div>;
                    }
                })()}
            </div>
        </div>;
    }

    loadMore() {
        this.setState({
            content: [],
            loading: false
        });
    }

    toggleExpand = () => {
        this.setState({expand: !this.state.expand});
    };

    onScroll = (event) => {
        let target = event.target;
        if (this.page >= this.maxPage) {
            return;
        }
        if (target.scrollTop >= (target.scrollHeight - target.offsetHeight)) {
            this.page = this.page + 1;
            this.loadMore(this.state.query);
        }
    };

    onSearch(val) {

        this.setState({
            search: val,
            content: [],
            loading: false
        });
    }

    _onQueryInputChange = (e) => {
        clearTimeout(this._queryTimeout);
        this.setState({query: e.target.value});
        this._queryTimeout = setTimeout(() => {
            this.setState({content: []});
            this.page = 1;
            this.loadMore(this.state.query);
        }, 500);
    };

    customOptionStructure(item, clickFun) {
        return <li key={item.id} onClick={clickFun}>{item[this.state.optionLabelPath]}</li>;
    }

}
