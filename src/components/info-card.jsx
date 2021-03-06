import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import LocationSVG from './svg/location-svg';
import FromYouToPL from './svg/from-you-to-pl-svg';
import FromDestToPL from './svg/from-dest-to-pl-svg';

import anime from 'animejs';

class InfoCard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let w = document.querySelector('.anime-control').offsetWidth;
        w = Math.floor((w - 340) / w * 100);
        anime({
            targets: '.info-card',
            translateX: ['-100%', 0],
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 1500
        });
        anime({
            targets: '.anime-control',
            width: ['100%', `${w}%`],
            easing: 'easeInQuad',
            duration: 1500
        });
    }

    render() {
        const { pl } = this.props;
        return (
            <div className='info-card'>
                <div className='info-wrapper'>
                    <button className='close-btn' onClick={this.handleCloseButton}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.3333 8.54666L23.4533 6.66666L16 14.12L8.54666 6.66666L6.66666 8.54666L14.12 16L6.66666 23.4533L8.54666 25.3333L16 17.88L23.4533 25.3333L25.3333 23.4533L17.88 16L25.3333 8.54666Z" fill="black" fillOpacity="0.54"/>
                        </svg>
                    </button>
                    <img alt='parking lot photo' src={pl.img} />
                    <h4>{pl.title}</h4>
                    <hr/>
                    <div className='info-container'>
                        <div name='address'>
                            <LocationSVG />
                            <span id='address'>{pl.address}</span>
                        </div>
                        <div name='distance'>
                            <FromYouToPL color={this.props.colorMapping(pl.vacant)} />
                            <span id='distance-from-you-to-pl'>{pl.distanceFromYou}</span>
                            <FromDestToPL color={this.props.colorMapping(pl.vacant)} />
                            <span id='distance-from-dest-to-pl'>{pl.distanceFromDest}</span>
                        </div>
                        <div name='capacity/vacant'>
                            <Button variant='primary'>
                                Capacity <Badge variant='light'>{pl.capacity}</Badge>
                            </Button>
                            <Button variant={this.themeMapping(pl.vacant)}>
                                Vacant <Badge variant='light'>{pl.vacant}</Badge>
                            </Button>
                        </div>
                        {this.renderRoutingInfo()}
                    </div>
                    <Button variant='primary' className='info-btn'
                        onClick={this.props.handleViewParkingLot}>
                        View Parking Slots
                    </Button>
                </div>
            </div>
        );
    }

    themeMapping(n) {
        if (n > 15) return 'success';
        if (n > 8) return 'warning';
        return 'danger';
    }

    handleCloseButton = async () => {
        await Promise.all([
            anime({
                targets: '.info-card',
                translateX: '-100%',
                opacity: 0,
                easing: 'easeInQuad',
                duration: 1500
            }).finished,
            anime({
                targets: '.anime-control',
                width: '100%',
                easing: 'easeInQuad',
                duration: 1500
            }).finished
        ]);
        this.props.handleCloseButton();
        return this;
    };

    renderRoutingInfo = () => {
        const { routeData } = this.props;
        if (Object.keys(routeData).length > 0) return (
            <div className='routing-container'>
                <div className='heading'>
                    <h6>From you to parking lot</h6>
                    <Button variant='info' size='sm'
                        onClick={() => this.props.drawRoute(routeData.yp, 'rgba(59, 99, 243, 0.7)')}>
                        View Route
                    </Button>
                </div>
                <hr/>
                <small>Estimated driving time: {routeData.yp.summary.travelTime.format()}</small>
                <ol className='directions'>
                    {routeData.yp.leg[0].maneuver.map((m, i) =>
                        this.renderInstruction(m, i)
                    )}
                </ol>
                <div className='heading'>
                    <h6>From parking lot to destination</h6>
                    <Button variant='info' size='sm'
                        onClick={() => this.props.drawRoute(routeData.pd, 'rgba(243, 59, 158, 0.7)')}>
                        View Route
                    </Button>
                </div>
                <hr/>
                <small>Estimated walking time: {routeData.pd.summary.travelTime.format()}</small>
                <ol className='directions'>
                    {routeData.pd.leg[0].maneuver.map((m, i) =>
                        this.renderInstruction(m, i)
                    )}
                </ol>
            </div>
        );
    };

    renderInstruction = (m, i) => {
        return (
            <li key={i}>
                <span className={'arrow ' + m.action} />
                <span dangerouslySetInnerHTML={{ __html: m.instruction }} />
            </li>
        );
    };
}

Number.prototype.format = function () {
    if (Math.floor(this / 60) > 0)
        return `${Math.floor(this / 60)} minutes ${this % 60} seconds`;
    return `${this} seconds`;
};

export default InfoCard;
