import React, { Component } from 'react';

import { paper } from 'paper';
import anime from 'animejs';

const { Path, Point, Raster, Group } = paper;

class View extends Component {
    constructor(props) {
        super(props);
        this.items = [];
    }

    componentDidMount() {
        anime({
            targets: '.grey-bkg',
            translateY: ['-100%', 0],
            opacity: [0, 1],
            easing: 'easeOutQuad',
            duration: 1500
        });
        paper.setup(this.canvas);
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    render() {
        return (
            <div className='view-container grey-bkg'>
                <button className='close-view-btn'
                    onClick={this.handleCloseButton}>
                    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.5834 13.3542L36.6459 10.4167L25 22.0625L13.3542 10.4167L10.4167 13.3542L22.0625 25L10.4167 36.6458L13.3542 39.5833L25 27.9375L36.6459 39.5833L39.5834 36.6458L27.9375 25L39.5834 13.3542Z" fill="black" fillOpacity="0.54"/>
                    </svg>
                </button>
                <canvas ref = { c => this.canvas = c }
                    id='parking-lot-view'
                    resize='true'>
                </canvas>
                <div className='hidden'>
                    <img id='occupied' src='/images/occupied.png'></img>
                    <img id='vacant' src='/images/vacant.png'></img>
                    <img id='banned' src='/images/banned.png'></img>
                    <img id='accessible' src='/images/accessible.png'></img>
                </div>
            </div>
        );
    }

    handleCloseButton = async () => {
        await anime({
            targets: '.grey-bkg',
            translateY: [0, '-100%'],
            opacity: [1, 0],
            easing: 'easeOutQuad',
            duration: 1500
        }).finished;
        this.props.handleCloseButton();
        return this;
    };

    resize = () => {
        [this.width, this.height] = [this.canvas.clientWidth, this.canvas.clientHeight];
        this.draw();
        return this;
    };

    clear = () => {
        this.items.forEach(item => item.remove());
        this.items = [];
        paper.view.update();
        return this;
    };

    draw = () => {
        this.clear();
        const { pl } = this.props;
        const [widthRatio, heightRatio] = [this.width / pl.layout.parkSize.width, this.height / pl.layout.parkSize.height];
        const [w, h] = [pl.layout.slotSize.width * widthRatio, pl.layout.slotSize.height * heightRatio]; // already scaled
        pl.layout.slots.forEach(ps => {
            this.drawParkingSlot(ps, w, h, widthRatio, heightRatio);
        });
        paper.view.draw();
        return this;
    };

    drawParkingSlot = (ps, w, h, wr, hr) => {
        const [x, y] = [ps.x * wr, ps.y * hr];
        let g = new Group([
            this.drawContour(x, y, w, h, ps.orient),
            this.drawFill(x, y, w, h, ps.orient),
            this.drawSign(x, y, w, h, ps.orient, ps.state)
        ]);
        g.data = this.props.pl;
        g.onMouseEnter = function(e) {
            document.getElementById('parking-lot-view').style.cursor = 'pointer';
            this.children[1].selected = true;
        };
        g.onMouseLeave = function(e) {
            document.getElementById('parking-lot-view').style.cursor = 'default';
            this.children[1].selected = false;
        };
        g.onClick = function(e) {
            console.log(this.data);
        };
        this.items.push(g);
        return this;
    };

    drawContour(x, y, w, h, orient) {
        let contour = new Path();
        contour.strokeColor = 'black';
        switch (orient) {
            case 'up':
                contour.add(new Point(x, y));
                contour.add(new Point(x, y + h));
                contour.add(new Point(x + w, y + h));
                contour.add(new Point(x + w, y));
                break;

            case 'down':
                contour.add(new Point(x, y + h));
                contour.add(new Point(x, y));
                contour.add(new Point(x + w, y));
                contour.add(new Point(x + w, y + h));
                break;

            case 'left': // width / height swapped
                contour.add(new Point(x, y));
                contour.add(new Point(x + h, y));
                contour.add(new Point(x + h, y + w));
                contour.add(new Point(x, y + w));
                break;

            case 'right': // width / height swapped
                contour.add(new Point(x + h, y));
                contour.add(new Point(x, y));
                contour.add(new Point(x, y + w));
                contour.add(new Point(x + h, y + w));
                break;
        }
        return contour;
    }

    drawFill(x, y, w, h, orient) {
        switch (orient) {
            case 'up':
            case 'down':
                return new Path.Rectangle({
                    point: [x, y],
                    size: [w, h],
                    opacity: 0,
                    fillColor: 'white'
                });

            default: // left / right
                return new Path.Rectangle({
                    point: [x, y],
                    size: [h, w],
                    opacity: 0,
                    fillColor: 'white'
                });
        }
    }

    drawSign(x, y, w, h, orient, state) {
        let sign = new Raster(state);
        switch (orient) {
            case 'up':
            case 'down':
                sign.position = [x + w / 2, y + h / 2];
                break;

            default: // left / right
                sign.position = [x + h / 2, y + w / 2];
        }
        sign.scale(w / 100);
        return sign;
    }
}

export default View;
