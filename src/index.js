import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router from "./Router";
import {BrowserRouter} from "react-router-dom";
import {StyleRoot} from "radium";


ReactDOM.render(
    <StyleRoot>
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    </StyleRoot>,
    document.getElementById('root'));
registerServiceWorker();
