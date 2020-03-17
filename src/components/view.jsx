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
                    strokeColor: 'black',
                    strokeWidth: 10,
                }),
                new paper.Path.Line({
                    from: [60, 0],
                    to: [60, 100],
                    strokeColor: 'black',
                    strokeWidth: 10,
                })
            ],
        });
        paper.view.draw();
    }
}

export default View;

/*
    drawCanvas() {
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        this.state.layout.slots.map( coord => {
            ctx.moveTo(coord[0], coord[1]);
            ctx.lineTo(coord[0], coord[1] + 100);
            ctx.stroke();
        });
        ctx.setLineDash([5, 3]);
        this.state.layout.dash.map( item => {
            ctx.moveTo(item[0], item[1]);
            item[2] == 'x' ? ctx.lineTo(item[0] + item[3], item[1]) : ctx.lineTo(item[0], item[1] + item[3]);
            ctx.stroke();
        })
    }
*/