import React, { Component } from 'react';
import './stylesheets/infosec.css';
import Footer from "./components/Footer.js"
import {withRouter} from "react-router-dom";
import Header from "./components/Header";

class InfoSec extends Component {
    render() {
        return (
            <div className="infosec">
                <Header/>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(InfoSec);
