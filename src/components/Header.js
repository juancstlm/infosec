import React from "react"
import {withRouter} from "react-router-dom";

import '../stylesheets/header.css'
import {Button, CircleButton, Icon} from "ic-snacks";

class Header extends React.Component{
    render(){
        return(
            <div className="header">
                <h1>Information Security</h1>
                <div className='header-authenticate'>
                    <CircleButton snacksStyle="secondary" size="standard">
                        <Icon name='iconPerson'></Icon>
                    </CircleButton>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)