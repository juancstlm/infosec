import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/panel.css'

export default class Panel extends React.Component{

    render(){
        return(
            <div className='panel'>
                {/*Profile Panel Title*/}
                <h4 className='panel_h4'>{this.props.title}</h4>
                {/*Profile Panel Content*/}
                {this.props.content}
                {this.props.children}
            </div>
        );
    }
}

Panel.propTypes = {
    children: PropTypes.node,
    content: PropTypes.node,
    title: PropTypes.string.isRequired,
    size: PropTypes.string
};
