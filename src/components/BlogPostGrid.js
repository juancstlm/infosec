import React from 'react'
import PropTypes from 'prop-types';
import BlogPostCard from './BlogPostCard'

export default class BlogPostGrid extends React.Component{

    renderPostCards=()=>{
        return (
            this.props.blogPosts.map((post)=><BlogPostCard postid={post} key={post}/>)
        )
    }

    render(){
        return(
            <div className='blog_post_grid'>
                {this.renderPostCards()}
            </div>
        )
    }
}
BlogPostGrid.propTypes = {
    blogPosts: PropTypes.array,
}
BlogPostGrid.defaultProps = {
    blogPosts: ['1','2']
}
