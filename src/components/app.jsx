import React, { Component } from 'react';
import Preface from './preface';
import Main from './main';

import anime from 'animejs';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderPreface: true,
            currentLocation: {}
        };
    }

    render() {
        if (this.state.renderPreface)
            return (
                <Preface handleGetStartedBtn={this.handleGetStartedBtn} />
            );
        else
            return (
                <Main currentLocation={this.state.currentLocation} />
            );
    }

    handleGetStartedBtn = async () => {
        const [_, pos] = await Promise.all([
            anime({
                targets: '.grey-bkg',
                opacity: [1, 0],
                translateY: '-100%',
                easing: 'easeInQuad',
                duration: 4000
            }).finished,
            new Promise(resolve => {
                const geoLocationOptions = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                navigator.geolocation.getCurrentPosition(
                    pos => resolve(pos),
                    err => alert(err.message),
                    geoLocationOptions
                );
            })
        ]);
        if (!pos) return;
        this.setState({
            renderPreface: false,
            currentLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
        });
    };


}

export default App;
