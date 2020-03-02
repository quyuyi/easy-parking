import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import TitleSVG from './title-svg';
import Map from './map';

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
            destination: {}
        };
        this.rangeMapping = {
            '100 m': 800,
            '200 m': 1000,
            '500 m': 2000,
            '1 km': 4000
        },
        this.geocoderToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiI4VjFyQ1VIYTQxMk1zZHlqRGpyTyIsImlhdCI6MTU4MzAzOTQ3MSwiZXhwIjoxNTgzMTI1ODcxLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLjBPby1GaWUzemIzY3NGTG1zVVdyZlEuZXZKTUpnTHhCaHZUZkF4d3pTNFZRaVNnRmIxczBOUHJGc0JvS0NBSWlIWEVzSUFjVExjenRXd2RPa0MxS1pDVGN6LTN6RHRCQm95VTNWRk5lUmVJZ1JoSGhHNFl3VllZWEFHWmJuV2xId1JmZTB5TUktRGFORUozTjJrVDI1aTIuUEJETnhSWHR0dEdlSThxOXhqM0xBTUxNMWRRTU85LThJeV9GYXJYTjBmMA.rG-rgs4TMDfEUrn6SpLWHTO5zvonKNrcj1nuxKNfak56LCoKc2_aKC0EfeKLqZCnH80qzjMF22bm9kGc_6HRFw8mixNJ2R9F6tZq0wusCDwN-Nz9YW_dnjH-Lrn-iSI1k5Q-Ci2qmv4o3w4y92z9IVelHYnAGrg5VWKsS8ZCwbgnQRWuErY-JjV-XfAfXeqWthubmKQLetRMCc5lTYiLyHBoyp-bIXr3CDu_JokJJJhYmXuF9uQXJDUe51Ke8CEETTXvGGeekb0OQCfwIOBgmYJnocm-n_9Dt9wsI41UoIInbmBbQTYPD_6fE3KQidg-1wJ0dVgr-_1BEjjEQd7jjw';
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
                        <Map enableControls={true}
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
                long: pos.coords.longitude,
                altitude: 2000
            }
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
            currentLocation: {
                lat: this.state.currentLocation.lat,
                long: this.state.currentLocation.long,
                altitude: this.rangeMapping[$('#input-distance').val()]
            },
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
