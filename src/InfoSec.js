import React, { Component } from 'react';
import './stylesheets/infosec.css';
import Footer from "./components/Footer.js"
import {withRouter} from "react-router-dom";
import Header from "./components/Header";
import BlogPost from "./components/BlogPost";

class InfoSec extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className="infosec">
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(InfoSec);
