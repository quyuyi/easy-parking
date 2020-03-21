import React, { Component } from 'react';
import { paper } from 'paper';

const { Path, Point, Raster, Group } = paper;
const ParkingLotsDB = require('../db.js');

class View extends Component {
    constructor(props) {
        super(props);
        this.items = [];
        this.layout = ParkingLotsDB[1].layout;
    }

    componentDidMount() {
        paper.setup(this.canvas);
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    render() {
        return (
            <div className='grey-bkg'>
                <canvas ref = { c => this.canvas = c }
                    id='parking-lot-view'
                    resize='true'>
                </canvas>
                <div className='hidden'>
                    <img id='occupied' src='/public/images/occupied.png'></img>
                    <img id='vacant' src='/public/images/vacant.png'></img>
                    <img id='banned' src='/public/images/banned.png'></img>
                    <img id='accessible'src='/public/images/accessible.png'></img>
                </div>
            </div>
        );
    }

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
        // const { pl } = this.props;
        // const [widthRatio, heightRatio] = [this.width / pl.parkSize.width, this.height / pl.parkSize.height];
        const [widthRatio, heightRatio] = [this.width / this.layout.parkSize.width, this.height / this.layout.parkSize.height];
        const [w, h] = [this.layout.slotSize.width * widthRatio, this.layout.slotSize.height * heightRatio]; // already scaled
        this.layout.slots.forEach(ps => {
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
        g.onMouseEnter = function(e) {
            this.children[1].selected = true;
        };
        g.onMouseLeave = function(e) {
            this.children[1].selected = false;
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
        sign.onMouseEnter = e => {
            this.canvas.style.cursor = 'pointer';
        };
        sign.onMouseLeave = e => {
            this.canvas.style.cursor = 'default';
        };
        sign.onClick = function(e) {
            console.log('sign clicked');
        };
        return sign;
    }
}

export default View;
