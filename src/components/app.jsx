import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TitleSVG from './title-svg';
import Map from './map';
import AnotherMap from './anothermap';

import anime from 'animejs';
const $ = require('jquery');
const token = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiI4VjFyQ1VIYTQxMk1zZHlqRGpyTyIsImlhdCI6MTU4MzAzOTQ3MSwiZXhwIjoxNTgzMTI1ODcxLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLjBPby1GaWUzemIzY3NGTG1zVVdyZlEuZXZKTUpnTHhCaHZUZkF4d3pTNFZRaVNnRmIxczBOUHJGc0JvS0NBSWlIWEVzSUFjVExjenRXd2RPa0MxS1pDVGN6LTN6RHRCQm95VTNWRk5lUmVJZ1JoSGhHNFl3VllZWEFHWmJuV2xId1JmZTB5TUktRGFORUozTjJrVDI1aTIuUEJETnhSWHR0dEdlSThxOXhqM0xBTUxNMWRRTU85LThJeV9GYXJYTjBmMA.rG-rgs4TMDfEUrn6SpLWHTO5zvonKNrcj1nuxKNfak56LCoKc2_aKC0EfeKLqZCnH80qzjMF22bm9kGc_6HRFw8mixNJ2R9F6tZq0wusCDwN-Nz9YW_dnjH-Lrn-iSI1k5Q-Ci2qmv4o3w4y92z9IVelHYnAGrg5VWKsS8ZCwbgnQRWuErY-JjV-XfAfXeqWthubmKQLetRMCc5lTYiLyHBoyp-bIXr3CDu_JokJJJhYmXuF9uQXJDUe51Ke8CEETTXvGGeekb0OQCfwIOBgmYJnocm-n_9Dt9wsI41UoIInbmBbQTYPD_6fE3KQidg-1wJ0dVgr-_1BEjjEQd7jjw'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderPrefaceMap: true,
            playAnimation: false,
            requestSubmitted: false,
            validated: false,
            currentLocation: {},

            locations:[],
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

        this.handleGetStartedBtn();
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
        console.log("render");
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
                                    // disabled={this.state.requestSubmitted}
                                    onClick={this.handleSubmit}
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

    handleSubmit() {
        const dest = document.getElementById('input-destination').value;
        console.log(dest);
        console.log(token);
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${dest}`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        fetch(proxyurl+url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
        })
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(data => {
            console.log(data);
            const locations=data.items;
            let position, marker;
            // const map = document.getElementsByClassName("canvas-map");
            for (let i = 0;  i < locations.length; i++) {
                position = {
                lat: locations[i].position.lat,
                lng: locations[i].position.lng,
                };
                // marker = Marker(position);
                // map.addObject(marker);
            }
        })
        .catch(error => console.log(error));
    }
}

export default App;
