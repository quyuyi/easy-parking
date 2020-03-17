import React, { Component } from 'react';
import { paper } from 'paper';

const ParkingLotsDB = require('../db.js');

class View extends Component {
    constructor(props) {
        super(props);
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
            <div id='grey-bkg'>
                <canvas ref = { c => this.canvas = c; }
                    id="my-canvas">
                </canvas>
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
        this.clear();
        const { pl } = this.props;
        const [widthRatio, heightRatio] = [this.width / pl.width, this.height / pl.height];
        let path = new paper.CompoundPath({
            children: [
                new paper.Path.Line({
                    from: [10, 0],
                    to: [10, 100],
                }),
                new paper.Path.Line({
                    from: [60, 0],
                    to: [60, 100],
                }),
                new paper.Path.Rectangle({
                    from: [10, 0],
                    to: [60, 100],
                    opacity: 0,
                })
            ],
            strokeColor: 'black',
            fillColor: 'white',
        });
        path.onClick = function(event) {
            console.log("click");
        }
        paper.view.draw();
        return this;
    };

    clear = () => {

    };
}

export default View;
