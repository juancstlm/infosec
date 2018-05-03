import React from 'react'
import PropTypes from 'prop-types';
import Header from "./Header";
import Footer from "./Footer"; // ES6

export default class BlogPost extends React.Component{
    render(){


        const backgroundImage = {
            backgroundImage: `url(${this.props.image})`,
        }

        return(
            <div>
                <Header/>
                <div className='blog-post'>
                <div className='blog-post-image' style={backgroundImage}>
                    <div className='blog-post-post_details'>
                        <div className='blog-post-title'>{this.props.title}</div>
                        <div>
                            <span className='blog-post-author'>Author: {this.props.author} | </span>
                            <span className='blog-post-author'>Published On 4/5/18</span>
                        </div>
                    </div>
                </div>
                <p>
                    {this.props.text}
                </p>
                </div>
                <Footer/>
            </div>

        )
    }
}

BlogPost.propTypes ={
    title: PropTypes.string,
    author: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.string,
}
BlogPost.defaultProps ={
    title: 'Blog Post Title',
    author: 'Juan Castillo',
    image: 'https://s3-us-west-1.amazonaws.com/juancastillom.com/post1.jpeg',
    text:'Text goes here'
}