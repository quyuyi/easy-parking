import React, { Component } from 'react';
import ReactDom from 'react-dom';
import '../../static/style.css';
import ParkingLotsDB from '../db.js';
import { paper } from 'paper';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: ParkingLotsDB[0].layout,
        };
    }

    componentDidMount() {
        this.draw();
    }

    render() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        return (
            <div id="view-continer">
                <canvas id="myCanvas" width={w*0.8} height={h*0.8}></canvas>
            </div>
        );
    }

    handleClick() {
        console.log("click!");
    }

    draw() {
        let canvas = document.getElementById("myCanvas");
        paper.setup(canvas);
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
        path.onClick = event => {
            console.log("click");
        }
        paper.view.draw();
    }
}

export default View;