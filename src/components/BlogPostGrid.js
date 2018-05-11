import React from 'react'
import PropTypes from 'prop-types';
import BlogPostCard from './BlogPostCard'
import {DynamoDB} from "aws-sdk";

var dynamodb

export default class BlogPostGrid extends React.Component{

  constructor(){
    super()
    this.setKeys()
    this.state = {
      blogPosts: [],
    }
    this.getBlogPosts()
  }

  renderPostCards=()=>{
    return (
      this.state.blogPosts.map((post)=><BlogPostCard postid={post} key={post}/>)
    )
  }

  getBlogPosts(){
    var params ={
      ExpressionAttributeNames:{
        '#I': 'postid'
      },
      TableName: "infosecblog",
      ProjectionExpression: "#I",
    }

    dynamodb.scan(params, (err, data)=>{
      if(err) console.log(err, err.stack);
      else {
        data.Items.forEach((item)=>{
          console.log(item.postid.S);
          this.setState({
            blogPosts: [...this.state.blogPosts, item.postid.S]
          })
        })
      }
    })
  }

  render(){
    return(
      <div className='blog_post_grid'>
        {this.renderPostCards()}
      </div>
    )
  }

  setKeys(){
    dynamodb = new DynamoDB({
      region: require('../credentials').region,
      credentials: {
        accessKeyId: require('../credentials').accessKeyId,
        secretAccessKey: require('../credentials').secretAccessKey,
      }})
    }
  }
