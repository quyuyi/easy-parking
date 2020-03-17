import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/stylesheets/master.scss';

import React from 'react';
import ReactDom from 'react-dom';
import App from './components/app';
import 'regenerator-runtime/runtime';
import View from './components/view';

const $ = require('jquery');

$(() => {
    ReactDom.render(<View />, document.getElementById('root'));
});
