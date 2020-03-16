import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import TitleSVG from './svg/title-svg';
import HarpMap from './harp-map';

import anime from 'animejs';

class Preface extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        anime.timeline({
            easing: 'easeOutQuad',
            duration: 1500
        }).add({
            targets: '#title svg path',
            strokeDashoffset: [anime.setDashoffset, 0],
            delay: (e, i) => i * 600,
            direction: 'alternate'
        }).add({
            targets: '#preface-dialog',
            opacity: [0, 1]
        });
    }

    render() {
        return (
            <div id='preface'>
                <div className='grey-bkg'>
                    <Container className='center-padding'>
                        <div id='title' className='text-center'>
                            <TitleSVG />
                        </div>
                        <div id='preface-dialog'>
                            <p id='subtitle' className='text-center'>
                                A tool to help you find your parking slot.
                            </p>
                            <button className='customized-btn'
                                onClick={this.props.handleGetStartedBtn}
                            >
                                Get Started
                            </button>
                        </div>
                    </Container>
                </div>
                <HarpMap />
            </div>
        );
    }
}

export default Preface;
