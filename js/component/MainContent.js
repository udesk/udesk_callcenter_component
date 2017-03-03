import React from 'react';
import CallInfo from '../CallInfo';
import HangupPanel from './HangupPanel';
import TalkingPanel from './TalkingPanel';
import RingingPanel from './RingingPanel';

class MainContent extends React.Component {
    constructor() {
        super();

        this.state = {
            callState: 'hangup'
        };

        let self = this;
        CallInfo.on('change', function(k, v) {
            if (k === 'state') {
                self.setState({ callState: v });
            }
        });
    }

    render() {
        let className = this.props.className + ' content-wrapper';
        let content;
        if (this.state.callState === 'hangup') {
            content = <HangupPanel />;
        } else if (this.state.callState === 'talking') {
            content = <TalkingPanel/>;
        } else if (this.state.callState === 'ringing') {
            content = <RingingPanel/>;
        }
        return <div className={className}>
            {content}
        </div>
    }
}

export default MainContent;