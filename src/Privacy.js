import React, { Component } from 'react';
import Footer from "./components/Footer.js"
import {withRouter} from "react-router-dom";
import TextFileReader from "./components/TextFileReader";

import './stylesheets/privacy.css'
import Header from "./components/Header";

const Last = require("./text/privacy/Last.txt");
const Info = require("./text/privacy/Info.txt");
const How = require("./text/privacy/How.txt");
const What = require("./text/privacy/What.txt");
const Changes = require("./text/privacy/Changes.txt");
const Cali = require("./text/privacy/California.txt");

class Privacy extends Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="infosec">
                <Header/>
                <div>
                    <div className='privacy-styles'>
                        <h1 className='privacy-page_title'> Privacy </h1>
                    </div>

                    <div>

                        <div className='privacy-divBorderW'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>Last Updated: April 19, 2018</h3>
                                <TextFileReader txt={Last}/>
                            </div>
                        </div>

                        <div className='privacy-divBorderG'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>Information we collect</h3>
                                <TextFileReader txt={Info}/>
                            </div>
                        </div>

                        <div className='privacy-divBorderW'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>How we use your information</h3>
                                <TextFileReader txt={How}/>
                            </div>
                        </div>


                        <div className='privacy-divBorderG'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>What We Share</h3>
                                <TextFileReader txt={What}/>
                            </div>
                        </div>

                        <div className='privacy-divBorderW'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>Changes to this Policy</h3>
                                <TextFileReader txt={Changes}/>
                            </div>
                        </div>

                        <div className='privacy-divBorderG'>
                            <div className='privacy-div_spacing'>
                                <h3 className='privacy-heading'>For Californian Residents</h3>
                                <TextFileReader txt={Cali}/>
                            </div>
                        </div>

                    </div>
                </div>

                <Footer/>
            </div>
        )
    }
}

export default withRouter(Privacy);