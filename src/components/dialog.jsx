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
        switch (b) {
            case 'OK':
                return (
                    <Button key={i} variant='success' onClick={this.handleOK}>
                        {b}
                    </Button>
                );

            case 'Yes':
                return (
                    <Button key={i} variant='success' onClick={this.handleYes}>
                        {b}
                    </Button>
                );

            case 'Cancel':
                return (
                    <Button key={i} variant='secondary' onClick={this.handleCancel}>
                        {b}
                    </Button>
                );

            case 'Try Another One':
                return (
                    <Button key={i} variant='danger' onClick={this.handleOK}>
                        {b}
                    </Button>
                );
        }
    };

    handleOK = async e => {
        e.target.disabled = true;
        e.target.style.cursor = 'wait';
        return await this.handleCloseDialog({...e});
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
        e.target.style.cursor = 'wait';
        return await this.handleCloseDialog({...e});
    };

    handleCloseDialog = async e => {
        await anime({
            targets: '.dialog-box',
            opacity: [1, 0],
            easing: 'easeOutQuad',
            duration: 600
        }).finished;
        e.target.disabled = false;
        e.target.style.cursor = 'default';
        this.props.handleCloseDialog();
        return Promise.resolve(this);
    };
}

export default Dialog;
