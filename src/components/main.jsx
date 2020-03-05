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
        this.geocoderToken = 'eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiI4VjFyQ1VIYTQxMk1zZHlqRGpyTyIsImlhdCI6MTU4MzE4MzAyNiwiZXhwIjoxNTgzMjY5NDI2LCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLlA3cVFvNXVYenBoeGZLS0pDalNfdEEudUYyVmlmRl82LWZsOTBBYnJQRWdpV2RsR0RyS3VXandmMVlCLVV0aTc1QWVRcTJmay0zXzRYd2wxSWxycV9uZzRZa1VyT2N5ZmJjM1pYWU8xM2QtUlJoR2xzTmhCTHJUeE14d2VMZDF1QVctR1JOTk4tU2RKejBJUGVobzQ1Q3guanVuWkVKZkN6NU93cF9YT2hVZjQtMjhBcE9SamIyak1yQndLZFFWSDNsTQ.SodEDk_xtVzfSpY82HbU-K6O3ePS784Sw8m1QTLG4TCuSOmZX3K-xbB-ajsdRBFps7dpndR17OO5N4FmD6s4uFiFuiuwGPrBJ2fNm0NmHRYaW3FNO9PJJGzKOHqNyf7zAFlU_TwX_yp1Rhfzc39jOcnjLPUnmaFiLi9g9pYo2macBieJ3YK2MQf0JMtTbN80TC7aGW91GeX4Wqtgo-qXV0c8ancjA3BkJe1jXXRoLeYgUIcnCamtpv10cU0zlFd7CTWhWczZLSYezJgYGPRszZdgPcVNzjCJT9991PdQSUuPGVld0WfM98XCw8VR60JQPEIiErKFRJIPgxbAx25ZVQ';
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
            destination: data[0]
        });
    };

    fetchResponse = async () => {
        const dest = $('#input-destination').val();
        const url = /* proxy */ "https://cors-anywhere.herokuapp.com/" + /* api */ `https://geocode.search.hereapi.com/v1/geocode?q=${dest}`;
        let res = await fetch(url, {
            method: 'GET', // GET, POST, PUT, DELETE, etc.
            headers: {
                'Authorization': `Bearer ${this.geocoderToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            return new Promise.resolve(data.items);
        }
        console.warn(res.statusText);
        // here api expired, use openstreetmap instead
        res = await fetch(`https://nominatim.openstreetmap.org/search/${dest}?format=json`, {
            method: 'GET'
        });
        if (!res.ok) {
            console.warn(res.statusText);
            return new Promise.resolve([]);
        }
        let data = await res.json();
        return new Promise(resolve => {
            data.sort(
                (a, b) => this.distanceFromCurrentLocation(a) - this.distanceFromCurrentLocation(b)
            );
            let rst = [];
            data.forEach(item => {
                rst.push({
                    position: {
                        lat: item.lat,
                        lng: item.lon
                    },
                    title: item['display_name']
                });
            });
            resolve(rst);
        });
    };
}

export default Main;
