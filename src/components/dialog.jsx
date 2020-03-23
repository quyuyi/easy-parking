import React, { Component, Fragment } from 'react';
import Button from 'react-bootstrap/Button';

import anime from 'animejs';

class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestChoice: true,
            res: {}
        };
    }

    componentDidMount() {
        anime({
            targets: '.dialog-box',
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 600
        });
    }

    render() {
        const { text, buttons } = this.props.property;
        return (
            <div className='dialog-box'>
                <h4>Confirm Your Choice</h4>
                <hr/>
                {this.renderContent(text, buttons)}
            </div>
        );
    }

    renderContent = (text, buttons) => {
        if (this.state.requestChoice)
            return (
                <Fragment>
                    <p>{text}</p>
                    <div className='my-btn-group' align='right'>
                        {buttons.map((b, i) => this.renderButtons(b, i))}
                    </div>
                </Fragment>
            );
        else
            return (
                <Fragment>
                    <p>{this.state.res.message}</p>
                    <div className='my-btn-group' align='right'>
                        {this.state.res.status && this.renderButtons('OK', 2)}
                        {!this.state.res.status && this.renderButtons('Try Another One', 2)}
                    </div>
                </Fragment>
            );
    };

    renderButtons = (b, i) => {
        let v, handler;
        switch (b) {
            case 'OK':
                v = 'success';
                handler = this.handleOK;
                break;

            case 'Yes':
                v = 'success';
                handler = this.handleYes;
                break;

            case 'Cancel':
                v = 'secondary';
                handler = this.handleCancel;
                break;

            case 'Try Another One':
                v = 'danger';
                handler = this.handleOK;
                break;
        }
        return (
            <Button key={i} variant={v} onClick={handler}>
                {b}
            </Button>
        );
    };

    handleOK = async e => {
        e.target.disabled = true;
        e.target.style.cursor = 'wait';
        !this.state.requestChoice && this.props.updateView();
        return await this.handleCloseDialog();
    };

    handleYes = async e => {
        e.target.disabled = true;
        e.target.style.cursor = 'wait';
        const { data } = this.props;
        const res = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.pl._id,
                i: data.i
            })
        });
        if (!res.ok) console.warn('Can\'t hear from /api/book');
        const message = await res.json();
        this.setState({ requestChoice: false, res: message });
    };

    handleCancel = async e => {
        e.target.disabled = true;
        return await this.handleCloseDialog();
    };

    handleCloseDialog = async () => {
        await anime({
            targets: '.dialog-box',
            opacity: [1, 0],
            easing: 'easeOutQuad',
            duration: 600
        }).finished;
        this.props.handleCloseDialog();
        return Promise.resolve(this);
    };
}

export default Dialog;
