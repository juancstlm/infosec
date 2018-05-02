import React, { Component } from 'react';
import './stylesheets/infosec.css';
import Footer from "./components/Footer.js"
import {withRouter} from "react-router-dom";

class InfoSec extends Component {
    render() {
        return (
            <div className="infosec">
                <header className="infosec-header">
                    <h1>Information Security</h1>
                </header>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(InfoSec);
