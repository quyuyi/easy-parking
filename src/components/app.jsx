import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import TitleSVG from './title-svg';
import HarpMap from './harp-map';
import HereMap from './here-map';

import anime from 'animejs';
const $ = require('jquery');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderPrefaceMap: true,
            requestSubmitted: false,
            validated: false,
            currentLocation: {},
            autoComplete: [],
            destination: {},
            altitude: 17
        };
        this.rangeMapping = {
            '100 m': 18,
            '200 m': 17,
            '500 m': 16,
            '1 km': 14
        },
        this.geocoderToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiI4VjFyQ1VIYTQxMk1zZHlqRGpyTyIsImlhdCI6MTU4MzE4MzAyNiwiZXhwIjoxNTgzMjY5NDI2LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLlA3cVFvNXVYenBoeGZLS0pDalNfdEEudUYyVmlmRl82LWZsOTBBYnJQRWdpV2RsR0RyS3VXandmMVlCLVV0aTc1QWVRcTJmay0zXzRYd2wxSWxycV9uZzRZa1VyT2N5ZmJjM1pYWU8xM2QtUlJoR2xzTmhCTHJUeE14d2VMZDF1QVctR1JOTk4tU2RKejBJUGVobzQ1Q3guanVuWkVKZkN6NU93cF9YT2hVZjQtMjhBcE9SamIyak1yQndLZFFWSDNsTQ.SodEDk_xtVzfSpY82HbU-K6O3ePS784Sw8m1QTLG4TCuSOmZX3K-xbB-ajsdRBFps7dpndR17OO5N4FmD6s4uFiFuiuwGPrBJ2fNm0NmHRYaW3FNO9PJJGzKOHqNyf7zAFlU_TwX_yp1Rhfzc39jOcnjLPUnmaFiLi9g9pYo2macBieJ3YK2MQf0JMtTbN80TC7aGW91GeX4Wqtgo-qXV0c8ancjA3BkJe1jXXRoLeYgUIcnCamtpv10cU0zlFd7CTWhWczZLSYezJgYGPRszZdgPcVNzjCJT9991PdQSUuPGVld0WfM98XCw8VR60JQPEIiErKFRJIPgxbAx25ZVQ';
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

    componentDidUpdate() {
        if (!this.state.renderPrefaceMap && this.playAnimation) {
            anime({
                targets: ['#app', '#app .input-fields'],
                opacity: [0, 1],
                easing: 'easeOutQuad',
                duration: 3000
            });
            this.playAnimation = false;
            $('#input-destination').on('keypress', function() {
                let that = document.getElementById('input-destination');
                clearTimeout(that.timeoutRegister);
                that.timeoutRegister = setTimeout(async () => {
                    const { items: data } = await this.fetchResponse();
                    this.setState({ autoComplete: data });
                }, 1000);
            }.bind(this));
        }
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
                    { this.state.renderPrefaceMap && <HarpMap /> }
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
                                    <Form.Control.Feedback type='invalid'
                                        className='alert alert-danger'
                                    >
                                        Please choose a destination.
                                    </Form.Control.Feedback>
                                    <Form.Text>
                                        {this.state.autoComplete.slice(0, 5).map((e, i) => (
                                            <Alert key={i} variant='info'
                                                onClick={e => this.autoFill(e)}
                                            >
                                                {e.title}
                                            </Alert>
                                        ))}
                                    </Form.Text>
                                </Form.Group>
                            </div>
                            <div className='col-2'>
                                <Form.Group controlId='input-distance'>
                                    <Form.Control as='select' required>
                                        <option>Within</option>
                                        {Object.keys(this.rangeMapping).map((e, i) => <option key={i}>{e}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'
                                        className='alert alert-danger'
                                    >
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
                        <HereMap
                            altitude={this.state.altitude}
                            currentLocation={this.state.currentLocation}
                            destination={this.state.destination}
                        /> }
                </main>
            </Fragment>
        );
    }

    autoFill = e => {
        $('#input-destination').val(e.currentTarget.innerText);
        this.setState({ autoComplete: [] });
    }

    handleGetStartedBtn = async () => {
        const [_, pos] = await Promise.all([
            new Promise(resolve => {
                anime({
                    targets: '.grey-bkg',
                    opacity: [1, 0],
                    translateY: '-100%',
                    easing: 'easeInQuad',
                    duration: 4000
                }).finished.then(resolve);
            }),
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
        $('#app .container').removeClass('hidden');
        this.playAnimation = true;
        this.setState({
            renderPrefaceMap: false,
            currentLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            },
            altitude: 17
        });
    };

    submitSearchRequest = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        if ($('#input-distance').val() === 'Within')
            $('#input-distance').addClass('is-invalid');
        else if (!form.checkValidity()) {
            e.stopPropagation();
            $('#input-distance').removeClass('is-invalid');
            this.setState({ validated: true });
        }
        else {
            $('#input-distance').removeClass('is-invalid');
            this.setState({ requestSubmitted: true, validated: true });
        }
        // validation finished, submit request
        const { items: data } = await this.fetchResponse();
        this.setState({
            requestSubmitted: false,
            altitude: this.rangeMapping[$('#input-distance').val()],
            destination: data[0]
        });
    };

    fetchResponse = async () => {
        const dest = $('#input-destination').val();
        const url = /* proxy */ "https://cors-anywhere.herokuapp.com/" + /* api */ `https://geocode.search.hereapi.com/v1/geocode?q=${dest}`;
        const res = await fetch(url, {
            method: 'GET', // GET, POST, PUT, DELETE, etc.
            headers: {
                'Authorization': `Bearer ${this.geocoderToken}`,
                'Content-Type': 'application/json'
            }
        });
        !res.ok && console.warn(res.statusText);
        return res.json(); // array of matched candidate locations
    };
}

export default App;
