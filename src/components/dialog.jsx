import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import anime from 'animejs';

class Dialog extends Component {
    constructor(props) {
        super(props);
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
                <p>{text}</p>
                <div className='my-btn-group' align='right'>
                    {buttons.map((b, i) => this.renderButtons(b, i))}
                </div>
            </div>
        );
    }

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
        }
    };

    handleOK = async e => {
        e.target.disabled = true;
        return await this.handleCloseDialog();
    };

    handleYes = async e => {
        e.target.disabled = true;
        const { data } = this.props;
        // send request
        const res = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.pl._id,
                x: data.ps.x,
                y: data.ps.y
            })
        });
        if (!res.ok) console.warn('Can\'t hear from /api/book');
        const message = await res.json();
        console.log(message);
        return await this.handleCloseDialog();
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
