import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/stylesheets/master.scss';

import React from 'react';
import ReactDom from 'react-dom';
import App from './components/app';
import 'regenerator-runtime/runtime';

const $ = require('jquery');

$(() => {
    ReactDom.render(<App />, document.getElementById('root'));
});
