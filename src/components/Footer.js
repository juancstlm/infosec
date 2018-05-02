import React, { Component } from 'react';
import {Link, withRouter} from "react-router-dom";

import '../stylesheets/footer.css'

class Footer extends Component {
    render(){
        return(
            <div className='footer-position'>
                <div className='footer-style'>
                    <div>
                        <div className='footer-links_container'>
                            <Link to={"./privacy"} className='footer-links'>Privacy</Link>
                        </div>
                        <div className='footer-spacing'>
                            Copyright © {new Date().getFullYear()}
                            <a href={"https://github.com/juancstlm"} className='footer-links'>Juan Castillo</a>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default withRouter(Footer);