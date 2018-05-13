import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router from "./Router";
import {BrowserRouter} from "react-router-dom";
import {StyleRoot} from "radium";
import {themer} from 'ic-snacks';
import {theme} from './theme'
import Header from './components/Header'

themer.themeConfig = theme; //IC-Snacks theme for WeMart

ReactDOM.render(
    <StyleRoot>
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    </StyleRoot>,
    document.getElementById('root'));
registerServiceWorker();
