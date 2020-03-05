import React, { Component } from 'react';
import SearchForm from './search-form';
import HereMap from './here-map';

import anime from 'animejs';
const $ = require('jquery');

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: {},
            altitude: 17
        };
        this.rangeMapping = {
            '100 m': 18,
            '200 m': 17,
            '500 m': 16,
            '1 km': 14
        };
    }

    componentDidMount() {
        anime({
            targets: ['#app', '#app .input-fields'],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 3000
        });
    }

    render() {
        return (
            <main id='app'>
                <SearchForm
                    rangeMapping={this.rangeMapping}
                    submitSearchRequest={this.submitSearchRequest}
                    fetchResponse={this.fetchResponse}
                />
                <HereMap
                    altitude={this.state.altitude}
                    currentLocation={this.props.currentLocation}
                    destination={this.state.destination}
                />
            </main>
        );
    }

    distanceFromCurrentLocation = p => {
        const { lat, lng } = this.props.currentLocation;
        if (p.lat === lat && p.lon === lng) return 0;
        const R = 6371; // km
        const dlat = (p.lat - lat) * Math.PI / 180;
        const dlon = (p.lon - lng) * Math.PI / 180;
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(p.lat * Math.PI / 180) * (Math.sin(dlon / 2) ** 2);
        return R * 2 * Math.asin(Math.sqrt(a)); // km
    };

    submitSearchRequest = async btn => {
        btn.disabled = true;
        const data = await this.fetchResponse();
        btn.disabled = false;
        if (data.length === 0) {
            alert('Failed to locate your destination!');
            return;
        }
        this.setState({
            altitude: this.rangeMapping[$('#input-distance').val()],
            destination: {
                position: {
                    lat: data[0].lat,
                    lng: data[0].lon
                },
                title: data[0]['display_name']
            }
        });
    };

    fetchResponse = async () => {
        const dest = $('#input-destination').val();
        const res = await fetch(`https://nominatim.openstreetmap.org/search/${dest}?format=json`, {
            method: 'GET'
        });
        !res.ok && console.warn(res.statusText);
        let data = await res.json();
        return new Promise(resolve => {
            resolve(data.sort(
                (a, b) => this.distanceFromCurrentLocation(a) - this.distanceFromCurrentLocation(b)
            ));
        });
    };
}

export default Main;
