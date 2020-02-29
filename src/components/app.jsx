import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TitleSVG from './title-svg';
import Map from './map';

import anime from 'animejs';
const $ = require('jquery');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderPrefaceMap: true,
            playAnimation: false,
            requestSubmitted: false,
            validated: false,
            currentLocation: {}
        };
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
        const geoLocationOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(pos => {
            this.setState({
                currentLocation: {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                }
            });
        }, err => {
            alert(err.message);
        }, geoLocationOptions);
    }

    componentDidUpdate() {
        !this.state.renderPrefaceMap && this.state.playAnimation && anime({
            targets: ['#app', '#app .input-fields'],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 3000
        });
    }

    render() {
        return (       
            <Fragment>
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
                                    onClick={this.handleGetStartedBtn}
                                >
                                    Get Started
                                </button>
                            </div>
                        </Container>
                    </div>
                    { this.state.renderPrefaceMap && <Map /> }
                </div>

                <main id='app'>
                    <Container className='hidden'>
                        <Form noValidate validated={this.state.validated}
                            className='row input-fields'
                            onSubmit={e => this.submitSearchRequest(e)}
                        >
                            <div className='col-6 col-sm-7'>
                                <Form.Group controlId='input-destination'>
                                    <Form.Control type='text' placeholder='Your destination' required/>
                                    <Form.Control.Feedback type='invalid'>
                                        Please choose a destination.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className='col-2'>
                                <Form.Group controlId='input-distance'>
                                    <Form.Control as='select' required>
                                        <option>Within</option>
                                        <option>100 m</option>
                                        <option>200 m</option>
                                        <option>500 m</option>
                                        <option>1 km</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        Please choose a distance range.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className='col-3'>
                                <Button variant='success' type='submit'
                                    disabled={this.state.requestSubmitted}
                                >
                                    Search
                                </Button>
                            </div>
                        </Form>
                    </Container>
                    { !this.state.renderPrefaceMap &&
                        <Map enableControls='true'
                            currentLocation={this.state.currentLocation}
                        /> }
                </main>
            </Fragment>
        );
    }

    handleGetStartedBtn = () => {
        anime({
            targets: '.grey-bkg',
            opacity: [1, 0],
            translateY: '-100%',
            easing: 'easeInQuad',
            duration: 4000
        }).finished.then(() => {
            $('#app .container').removeClass('hidden');
            this.setState({ renderPrefaceMap: false, playAnimation: true });
        });
    };

    submitSearchRequest = e => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.stopPropagation();
            this.setState({ playAnimation: false, validated: true });
            return;
        }
        this.setState({ requestSubmitted: true, playAnimation: false, validated: true });
    };
}

export default App;
