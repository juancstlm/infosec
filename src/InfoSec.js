import React, { Component } from 'react';
import './stylesheets/infosec.css';
import {withRouter} from "react-router-dom";
import BlogPostGrid from './components/BlogPostGrid'


class InfoSec extends Component {
    render() {
        return (
            <div>
                <div className="infosec">
                    <div className='infosec-main_image'>
                        <div className='infosec-title'>Information Security Blog</div>
                    </div>
                    <BlogPostGrid/>
                </div>
            </div>
        );
    }
}

export default withRouter(InfoSec);
