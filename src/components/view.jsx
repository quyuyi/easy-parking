import React, { Component } from 'react';
import { paper } from 'paper';

const ParkingLotsDB = require('../db.js');

class View extends Component {
    constructor(props) {
        super(props);
        this.items = [];
        this.state = {
            layout: ParkingLotsDB[0].layout,
        };
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
                    id="my-canvas">
                </canvas>
                <div>
                    <img id='ban' src='public/images/banning_sign.png'></img>
                </div>
            </div>
        );
    }

    handleClick() {
        console.log("click!");
    }

    resize = () => {
        [this.width, this.height] = [this.canvas.clientWidth, this.canvas.clientHeight];
        this.draw();
        return this;
    };

    draw = () => {
        console.log("clear");
        this.clear();
        // const { pl } = this.props;
        // const [widthRatio, heightRatio] = [this.width / pl.parkSize.width, this.height / pl.parkSize.height];
        let [l, w] = [this.state.layout.slotSize.length, this.state.layout.slotSize.width];
        this.state.layout.slots.forEach( p => {
            let path = new paper.CompoundPath({
                children: [
                    new paper.Path.Line({
                        from: p.coord,
                        to: [p.coord[0], p.coord[1]+l],
                    }),
                    new paper.Path.Line({
                        from: [p.coord[0]+w, p.coord[1]],
                        to: [p.coord[0]+w, p.coord[1]+l],
                    }),
                    new paper.Path.Rectangle({
                        from: p.coord,
                        to: [p.coord[0]+w, p.coord[1]+l],
                        opacity: 0,
                    })
                ],
                strokeColor: 'black',
                fillColor: 'white',
            });
            this.items.push(path);
            if (p.occupied) {
                let raster = new paper.Raster('ban');
                raster.position = [p.coord[0]+0.5*w, p.coord[1]+0.5*l];
                raster.scale(0.03);
                raster.onClick = function(e) {
                    console.log("click on the sign");
                }
                path.onClick = function(e) {
                    console.log("click on banned slot");
                }
            } else {
                path.onClick = function(e) {
                    console.log("click on unoccupied slot");
                }
            }
            paper.view.draw();
        })
        return this;
    };

    clear = () => {
        this.items.forEach( p => p.remove());
        this.items = [];
        paper.view.update();
    };
}

export default View;