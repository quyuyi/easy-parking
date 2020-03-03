import React, { Component } from 'react';
import { MapView, MapViewEventNames, MapViewUtils } from '@here/harp-mapview';
import { GeoCoordinates } from '@here/harp-geoutils';
import { APIFormat, AuthenticationTypeMapboxV4, OmvDataSource } from '@here/harp-omv-datasource';

class HarpMap extends Component {
    constructor(props) {
        super(props);
        this.geoJsonDataSource = {};
    }

    componentDidMount() {
        this.mapView = new MapView({
            canvas: this.map,
            theme: '/public/javascripts/resources/berlin_tilezen_base_globe.json',
            maxVisibleDataSourceTiles: 40,
            tileCacheSize: 100
        });
        this.mapView.camera.position.set(0, 0, 800);
        this.currentLocation = this.props.currentLocation ? this.props.currentLocation : {
            lat: 42.279594,
            long: -83.732124,
            altitude: 4000
        }; // Ann Arbor by default
        this.mapView.geoCenter = new GeoCoordinates(this.currentLocation.lat, this.currentLocation.long, this.currentLocation.altitude);
        this.resizeMapView();
        window.addEventListener('resize', this.resizeMapView);
        const dataSource = new OmvDataSource({
            baseUrl: 'https://xyz.api.here.com/tiles/herebase.02',
            apiFormat: APIFormat.XYZOMV,
            styleSetName: 'tilezen',
            maxZoomLevel: 17,
            authenticationCode: 'AGwEJ8ueQiux3S0Amyj3ywA', // token for using map service
            authenticationMethod: AuthenticationTypeMapboxV4
        });
        this.mapView.addDataSource(dataSource);
        this.cameraSettings = {
            distance: 10,
            azimuth: 300
        };
        this.mapView.addEventListener(MapViewEventNames.Render, this.rotatingCamera);
        this.mapView.beginAnimation();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMapView);
        this.mapView.removeEventListener(MapViewEventNames.Render, this.rotatingCamera);
    }

    render() {
        return (
            <canvas ref={map => { this.map = map; }}
                className='canvas-map'>
            </canvas>
        );
    }

    resizeMapView = () => {
        this.mapView.resize(this.map.clientWidth, this.map.clientHeight);
    };

    rotatingCamera = () => {
        const polarity = this.cameraSettings.distance > 50 ? 0 : 1;
        this.mapView.lookAt(
            this.mapView.geoCenter,
            (this.cameraSettings.distance += 0.02 * polarity),
            45,
            (this.cameraSettings.azimuth += 0.02)
        );
    };
}

export default HarpMap;
