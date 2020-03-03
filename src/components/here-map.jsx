import React, { Component } from 'react';
import 'here-js-api/scripts/mapsjs-core';
import 'here-js-api/scripts/mapsjs-service';
import 'here-js-api/scripts/mapsjs-ui';
import 'here-js-api/scripts/mapsjs-mapevents';
import 'here-js-api/styles/mapsjs-ui.css';

const _ = require('lodash');

class HereMap extends Component {
    constructor(props) {
        super(props);
        this.markers = {};
        this.bubbles = {};
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
        this.markCurrentLocation();
        window.addEventListener('resize', this.resizeMap);
    }

    componentDidUpdate(prevProps) {
        const { altitude, destination } = this.props;
        if (!_.isEqual(destination, prevProps.destination)) {
            this.map.setCenter(destination.position)
                .setZoom(this.props.altitude);
        }
        else if (altitude !== prevProps.altitude) {
            this.map.setZoom(this.props.altitude);
        }
        this.markCurrentLocation().markDestination();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMap);
    }

    render() {
        return (
            <div id='here-map'></div>
        );
    }

    approxRegression(x) {
        return 84.21976354 * (0.4812851859 ** x);
    }

    resizeMap = () => {
        this.map.getViewPort().resize();
    };

    markCurrentLocation = () => {
        this.markers.clMarker && this.map.removeObject(this.markers.clMarker);
        this.bubbles.clBubble && this.ui.removeBubble(this.bubbles.clBubble);
        this.markers.clMarker = new H.map.Marker(this.props.currentLocation, {
            icon: new H.map.Icon(`<svg width="38" height="53" viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d)"><circle cx="19" cy="15" r="15" fill="#3B63F3"/></g><g filter="url(#filter1_d)"><path d="M19 45L6.00962 22.5L31.9904 22.5L19 45Z" fill="#3B63F3"/></g><circle cx="18.5" cy="14.5" r="7.5" fill="white"/><defs><filter id="filter0_d" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><filter id="filter1_d" x="2.00961" y="22.5" width="33.9808" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`)
        });
        this.map.addObject(this.markers.clMarker);
        this.bubbles.clBubble = new H.ui.InfoBubble({
            lat: this.props.currentLocation.lat + this.approxRegression(this.props.altitude),
            lng: this.props.currentLocation.lng
        }, {
            content: 'You are here'
        });
        this.ui.addBubble(this.bubbles.clBubble);
        return this;
    };

    markDestination = () => {
        this.markers.destMarker && this.map.removeObject(this.markers.destMarker);
        this.bubbles.destBubble && this.ui.removeBubble(this.bubbles.destBubble);
        const { destination } = this.props;
        if (!destination.position) return this;
        this.markers.destMarker = new H.map.Marker(destination.position, {
            icon: new H.map.Icon(`<svg width="38" height="53" viewBox="0 0 38 53" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d)"><circle cx="19" cy="15" r="15" fill="#F0F33B"/></g><g filter="url(#filter1_d)"><path d="M19 45L6.00962 22.5L31.9904 22.5L19 45Z" fill="#F0F33B"/></g><path d="M19 4L21.4697 11.6008H29.4616L22.996 16.2984L25.4656 23.8992L19 19.2016L12.5344 23.8992L15.004 16.2984L8.53838 11.6008H16.5303L19 4Z" fill="white"/><defs><filter id="filter0_d" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter><filter id="filter1_d" x="2.00962" y="22.5" width="33.9808" height="30.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`)
        });
        this.map.addObject(this.markers.destMarker);
        this.bubbles.destBubble = new H.ui.InfoBubble({
            lat: destination.position.lat + this.approxRegression(this.props.altitude),
            lng: destination.position.lng
        }, {
            content: 'Your destination'
        });
        this.ui.addBubble(this.bubbles.destBubble);
        return this;
    };
}

export default HereMap;
