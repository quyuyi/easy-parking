import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/stylesheets/master.scss';

const $ = require('jquery');

import React from 'react';
import ReactDom from 'react-dom';
import App from './components/app';

$(() => {
    ReactDom.render(<App />, document.getElementById('root'));
});
