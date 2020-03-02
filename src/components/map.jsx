import React, { Component } from 'react';
import { MapView, MapViewEventNames, MapViewUtils } from '@here/harp-mapview';
import { GeoCoordinates } from '@here/harp-geoutils';
import { APIFormat, AuthenticationTypeMapboxV4, OmvDataSource } from '@here/harp-omv-datasource';
import { MapControls, MapControlsUI } from '@here/harp-map-controls';
import { GeoJsonDataProvider } from '@here/harp-geojson-datasource';

const _ = require('lodash/core');
const GeoJSON = require('geojson');

class Map extends Component {
    constructor(props) {
        super(props);
        this.geoJsonDataSource = {};
    }

    componentDidMount() {
        this.mapView = new MapView({
            canvas: this.map,
            theme: 'https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_base.json',
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
        this.controls = new MapControls(this.mapView);
        if (this.props.enableControls) {
            const controlPanel = new MapControlsUI(this.controls);
            this.map.parentElement.appendChild(controlPanel.domElement);
        }
        else {
            this.cameraSettings = {
                distance: 10,
                azimuth: 300
            };
            this.mapView.addEventListener(MapViewEventNames.Render, this.rotatingCamera);
            this.mapView.beginAnimation();
        }
        this.props.destination && this.drawPoints('you', [{ lat: this.currentLocation.lat, lng: this.currentLocation.long }], '#0000ff', 30);
    }

    componentDidUpdate(prevProps) {
        const { currentLocation, destination } = this.props;
        if (!_.isEqual(destination, prevProps.destination)) {
            this.mapView.geoCenter = new GeoCoordinates(destination.position.lat, destination.position.lng, currentLocation.altitude);
            this.drawPoints('destination', [destination.position], '#ffff00', 30);
        }
        else if (currentLocation.altitude !== prevProps.currentLocation.altitude) {
            this.controls.setZoomLevel(MapViewUtils.calculateZoomLevelFromDistance(this.mapView, currentLocation.altitude));
        }
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

    createPoints(positions) {
        return GeoJSON.parse(positions, { Point: ['lat', 'lng'] });
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

    drawPoints = async (name, positions, color, size) => {
        this.geoJsonDataSource.hasOwnProperty(name) && this.mapView.removeDataSource(this.geoJsonDataSource[name]);
        this.geoJsonDataSource[name] = new OmvDataSource({
            dataProvider: new GeoJsonDataProvider(name, this.createPoints(positions)),
            name: name
        });
        await this.mapView.addDataSource(this.geoJsonDataSource[name]);
        const styles = [{
            when: `$geometryType == 'point'`,
            technique: 'circles',
            renderOrder: 100000,
            attr: {
                color: color,
                size: size
            }
        }];
        this.geoJsonDataSource[name].setStyleSet(styles);
        this.mapView.update();
    };
}

export default Map;
