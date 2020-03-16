import React, { Component, Fragment } from 'react';
import 'here-js-api/scripts/mapsjs-core';
import 'here-js-api/scripts/mapsjs-service';
import 'here-js-api/scripts/mapsjs-ui';
import 'here-js-api/scripts/mapsjs-mapevents';
import 'here-js-api/styles/mapsjs-ui.css';
import InfoCard from './info-card';

import anime from 'animejs';
const _ = require('lodash');
const DB = require('../db');

class HereMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfoCard: false,
            pl: {}
        };
        this.parkingLots = []; // each element is an object with six fields (position, title, address, capacity, vacant, img)
        this.markers = {
            plMarkers: []
        };
        this.bubbles = {
            plBubbles: []
        };
        this.reverseMapping = {
            18: 100,
            17: 200,
            16: 500,
            14: 1000
        };
    }

    componentDidMount() {
        this.platform = new H.service.Platform({
            'apikey': 'OqXJb4GUb7VXOTTjESv0R80Pa2C02RUWaMMIzQOGGb4'
        });
        const defaultLayers = this.platform.createDefaultLayers();
        this.map = new H.Map(
            document.getElementById('here-map'),
            defaultLayers.vector.normal.map,
            {
                zoom: this.props.altitude,
                center: this.props.currentLocation
            }
        );
        this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
        this.mapEvents = new H.mapevents.MapEvents(this.map);
        this.behavior = new H.mapevents.Behavior(this.mapEvents);
        this.behavior.disable(H.mapevents.Behavior.Feature.WHEEL_ZOOM | H.mapevents.Behavior.Feature.DBL_TAP_ZOOM);
        this.markCurrentLocation();
        window.addEventListener('resize', this.resizeMap);
        document.querySelectorAll('.H_zoom .H_btn.H_el').forEach(e => {
            e.addEventListener('click', this.redrawBubbles);
        });

    }

    componentDidUpdate(prevProps) {
        const { altitude, destination } = this.props;
        if (!_.isEqual(destination, prevProps.destination)) {
            this.map.setCenter(destination.position)
                .setZoom(this.props.altitude);
            this.markCurrentLocation().markDestination();
            this.searchParkingLots().markParkingLots();
        }
        else if (altitude !== prevProps.altitude) {
            this.map.setZoom(this.props.altitude);
            this.redrawBubbles();
            this.searchParkingLots().markParkingLots();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMap);
        document.querySelectorAll('.H_zoom .H_btn.H_el').forEach(e => {
            e.removeEventListener('click', this.redrawBubbles);
        });
        this.map.getObjects().forEach(obj => obj.dispose());
    }

    render() {
        return (
            <Fragment>
                <div id='here-map'></div>
                {this.state.showInfoCard && <InfoCard
                    pl={this.state.pl}
                    dist={this.props.dist}
                    colorMapping={this.colorMapping}
                    handleCloseButton={this.handleCloseButton}
                />}
            </Fragment>
        );
    }

    approxRegression(x) {
        return 84.21976354 * (0.4812851859 ** x);
    }

    colorMapping(n) {
        if (n > 15) return '#30FF1E';
        if (n > 8) return '#FFE81E';
        return '#FF1E1E';
    }

    resizeMap = () => {
        this.map.getViewPort().resize();
        return this;
    };

    clearMarker = m => {
        this.markers[m].dispose(); // clear associated event listeners along with itself
        this.markers[m] = undefined;
        return this;
    };

    clearBubble = b => {
        this.ui.removeBubble(this.bubbles[b]);
        this.bubbles[b] = undefined;
        return this;
    };

    redrawBubbles = async () => {
        const zoomLevel = await new Promise(resolve => {
            this.ui.getBubbles().forEach(b => b.close());
            this.clearBubble('clBubble').clearBubble('destBubble');
            this.bubbles.plBubbles.forEach(b => this.ui.removeBubble(b));
            this.bubbles.plBubbles = [];
            setTimeout(() => resolve(this.map.getZoom()), 300);
        });
        // redraw current location bubble
        let tmp = this.markers.clMarker.getGeometry();
        this.bubbles.clBubble = new H.ui.InfoBubble({
            lat: tmp.lat + this.approxRegression(zoomLevel),
            lng: tmp.lng
        }, {
            content: 'You are here'
        });
        this.ui.addBubble(this.bubbles.clBubble);
        // redraw destination bubble
        if (this.markers.destMarker) {
            tmp = this.markers.destMarker.getGeometry();
            this.bubbles.destBubble = new H.ui.InfoBubble({
                lat: tmp.lat + this.approxRegression(zoomLevel),
                lng: tmp.lng
            }, {
                content: 'Your destination'
            });
            this.ui.addBubble(this.bubbles.destBubble);
        }
        // redraw parking lots bubble
        this.markers.plMarkers.forEach(pl => {
            tmp = pl.getData();
            console.log(tmp);
            const bubble = new H.ui.InfoBubble({
                lat: tmp.position.lat + this.approxRegression(zoomLevel),
                lng: tmp.position.lng
            }, {
                content: `Vacant: <b>${tmp.vacant}</b>`
            });
            this.bubbles.plBubbles.push(bubble);
            this.ui.addBubble(bubble);
        });
        // close all the bubbles at the end
        this.ui.getBubbles().forEach(b => b.close());
        return this;
    };

    searchParkingLots = () => {
        const { dist, destination, currentLocation } = this.props;
        const maxDistance = this.reverseMapping[this.props.altitude];
        this.parkingLots = [];
        let i = 0;
        DB.forEach(pl => {
            if (dist(pl.position, destination.position) * 1000 > maxDistance)
                return;
            this.parkingLots.push(pl);
            this.parkingLots[i].vacant = Math.floor(Math.random() * pl.capacity);
            this.parkingLots[i].distanceFromYou = dist(pl.position, currentLocation).toFixed(2) + ' km';
            this.parkingLots[i].distanceFromDest = Math.floor(dist(pl.position, destination.position) * 1000) + ' m';
            i++;
        });
        return this;
    };

    markCurrentLocation = zoomLevel => {
        this.markers.clMarker && this.clearMarker('clMarker');
        this.bubbles.clBubble && this.clearBubble('clBubble');
        this.markers.clMarker = new H.map.Marker(this.props.currentLocation, {
            zIndex: 30,
            icon: new H.map.Icon(`<svg width="38" height="53" viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d)"><circle cx="19" cy="15" r="15" fill="#3B63F3"/></g><g filter="url(#filter1_d)"><path d="M19 45L6.00962 22.5L31.9904 22.5L19 45Z" fill="#3B63F3"/></g><circle cx="18.5" cy="14.5" r="7.5" fill="white"/><defs><filter id="filter0_d" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><filter id="filter1_d" x="2.00961" y="22.5" width="33.9808" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`)
        });
        this.map.addObject(this.markers.clMarker);
        this.bubbles.clBubble = new H.ui.InfoBubble({
            lat: this.props.currentLocation.lat + this.approxRegression(zoomLevel || this.props.altitude),
            lng: this.props.currentLocation.lng
        }, {
            content: 'You are here'
        });
        this.ui.addBubble(this.bubbles.clBubble);
        this.markers.clMarker.addEventListener('pointerenter', e => {
            e.target.setZIndex(10);
            this.bubbles.clBubble.open();
            document.getElementById('here-map').style.cursor = 'pointer';
        });
        this.markers.clMarker.addEventListener('pointerleave', e => {
            e.target.setZIndex(30);
            this.bubbles.clBubble.close();
            document.getElementById('here-map').style.cursor = 'default';
        });
        this.markers.clMarker.addEventListener('pointerup', e => {
            this.map.setCenter(e.target.getGeometry()).setZoom(17);
            this.redrawBubbles();
        });
        return this;
    };

    markDestination = zoomLevel => {
        this.markers.destMarker && this.clearMarker('destMarker');
        this.bubbles.destBubble && this.clearBubble('destBubble');
        this.bubbles.destBubble = undefined;
        const { destination } = this.props;
        if (!destination.position) return this;
        this.markers.destMarker = new H.map.Marker(destination.position, {
            zIndex: 20,
            icon: new H.map.Icon(`<svg width="38" height="53" viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d)"><circle cx="19" cy="15" r="15" fill="#F33B9E"/></g><g filter="url(#filter1_d)"><path d="M19 45L6.00962 22.5L31.9904 22.5L19 45Z" fill="#F33B9E"/></g><path d="M19 4L21.4697 11.6008H29.4616L22.996 16.2984L25.4656 23.8992L19 19.2016L12.5344 23.8992L15.004 16.2984L8.53838 11.6008H16.5303L19 4Z" fill="white"/><defs><filter id="filter0_d" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><filter id="filter1_d" x="2.00962" y="22.5" width="33.9808" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`)
        });
        this.map.addObject(this.markers.destMarker);
        this.bubbles.destBubble = new H.ui.InfoBubble({
            lat: destination.position.lat + this.approxRegression(zoomLevel || this.props.altitude),
            lng: destination.position.lng
        }, {
            content: 'Your destination'
        });
        this.ui.addBubble(this.bubbles.destBubble);
        this.markers.destMarker.addEventListener('pointerenter', e => {
            e.target.setZIndex(10);
            this.bubbles.destBubble.open();
            document.getElementById('here-map').style.cursor = 'pointer';
        });
        this.markers.destMarker.addEventListener('pointerleave', e => {
            e.target.setZIndex(20);
            this.bubbles.destBubble.close();
            document.getElementById('here-map').style.cursor = 'default';
        });
        this.markers.destMarker.addEventListener('pointerup', e => {
            this.map.setCenter(e.target.getGeometry()).setZoom(17);
            this.redrawBubbles();
        });
        return this;
    };

    markParkingLots = zoomLevel => {
        this.markers.plMarkers.forEach(m => m.dispose());
        this.bubbles.plBubbles.forEach(b => this.ui.removeBubble(b));
        this.markers.plMarkers = [];
        this.bubbles.plBubbles = [];
        // this.parkingLots.length === 0 && alert('Sorry, no parking lots with vacant slots found.');
        this.parkingLots.forEach((pl, i) => {
            const color = this.colorMapping(pl.vacant);
            const marker = new H.map.Marker(pl.position, {
                zIndex: 40,
                data: pl, // add parking lot data to associated marker
                icon: new H.map.Icon(`<svg width="38" height="53" viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d)"><circle cx="19" cy="15" r="15" fill="${color}"/></g><g filter="url(#filter1_d)"><path d="M19 45L6.00962 22.5L31.9904 22.5L19 45Z" fill="${color}"/></g><path d="M17.7441 17.9902V23H14.8145V8.78125H20.3613C21.429 8.78125 22.3665 8.97656 23.1738 9.36719C23.9876 9.75781 24.6126 10.3145 25.0488 11.0371C25.485 11.7533 25.7031 12.5703 25.7031 13.4883C25.7031 14.8815 25.2246 15.9818 24.2676 16.7891C23.3171 17.5898 21.9987 17.9902 20.3125 17.9902H17.7441ZM17.7441 15.6172H20.3613C21.1361 15.6172 21.7253 15.4349 22.1289 15.0703C22.5391 14.7057 22.7441 14.1849 22.7441 13.5078C22.7441 12.8112 22.5391 12.248 22.1289 11.8184C21.7188 11.3887 21.1523 11.1673 20.4297 11.1543H17.7441V15.6172Z" fill="white"/><defs><filter id="filter0_d" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><filter id="filter1_d" x="2.00962" y="22.5" width="33.9808" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`)
            });
            this.markers.plMarkers.push(marker);
            this.map.addObject(marker);
            const bubble = new H.ui.InfoBubble({
                lat: pl.position.lat + this.approxRegression(zoomLevel || this.props.altitude),
                lng: pl.position.lng
            }, {
                content: `Vacant: <b>${pl.vacant}</b>`
            });
            bubble.close(); // bubble is closed by default in case of overwhelming pop-ups
            this.bubbles.plBubbles.push(bubble);
            this.ui.addBubble(bubble);
            this.markers.plMarkers[i].addEventListener('pointerenter', e => {
                e.target.setZIndex(10);
                this.bubbles.plBubbles[i].open();
                document.getElementById('here-map').style.cursor = 'pointer';
            });
            this.markers.plMarkers[i].addEventListener('pointerleave', e => {
                e.target.setZIndex(40);
                this.bubbles.plBubbles[i].close();
                document.getElementById('here-map').style.cursor = 'default';
            });
            this.markers.plMarkers[i].addEventListener('pointerup', e => {
                this.map.setCenter(e.target.getGeometry()).setZoom(17);
                this.redrawBubbles();
                this.setState({
                    showInfoCard: true,
                    pl: pl
                });
            });
        });
        return this;
    };

    handleCloseButton = () => {
        this.setState({ showInfoCard: false });
        return this;
    };
}

export default HereMap;
