import React, { Component } from 'react';
import './stylesheets/infosec.css';
import Footer from "./components/Footer.js"
import {withRouter} from "react-router-dom";
import Header from "./components/Header";
import BlogPostGrid from './components/BlogPostGrid'


class InfoSec extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className="infosec">
                    <div className='infosec-main_image'>
                        <div className='infosec-title'>Information Security Blog</div>
                    </div>
                </div>
                <BlogPostGrid/>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(InfoSec);
