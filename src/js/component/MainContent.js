import PropTypes from 'prop-types';
import React from 'react';
import CallInfo from '../CallInfo';
import HangupPanel from './HangupPanel';
import RingingPanel from './RingingPanel';
import TalkingPanel from './TalkingPanel';

class MainContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            callState: 'hangup'
        };

        let self = this;
        CallInfo.on('change', this.callInfoChangeCb = function(k, v) {
            if (k === 'state') {
                self.setState({callState: v});
            }
        });
    }

    render() {
        let className = this.props.className + ' content-wrapper';
        let {callState} = this.state;
        return <div className={className}>
            <RingingPanel isShow={callState === 'ringing'}/>
            <TalkingPanel isShow={callState === 'talking'}/>
            <HangupPanel isShow={callState === 'hangup'} showManualScreenPop={this.props.showManualScreenPop}/>
        </div>;
    }

    componentWillUnmount() {
        CallInfo.off('change', this.callInfoChangeCb);
    }

    static propTypes = {
        className: PropTypes.string,
        showManualScreenPop: PropTypes.bool
    };
}

export default MainContent;
