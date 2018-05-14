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
    // dynamodb =  new DynamoDB({
    //     region: 'us-east-1',
    //     credentials: {
    //       accessKeyId: require('../credentials').accessKeyId,
    //       secretAccessKey: require('../credentials').secretAccessKey,
    //     }})
    if(process.env.NODE_ENV === 'development'){
      // userPool = new CognitoUserPool(require('../credentials').poolData);
      dynamodb =  new DynamoDB({
        region: 'us-east-1',
        credentials: {
          accessKeyId: require('../credentials').accessKeyId,
          secretAccessKey: require('../credentials').secretAccessKey,
        }})
        // ReCAPTCHA_Site_Key = require("../credentials").ReCAPTCHA_Site_Key;
      }
      else {
        // userPool = new CognitoUserPool({
        //     UserPoolId : process.env.UserPoolId,
        //     ClientId : process.env.ClientId
        // })
        dynamodb = new DynamoDB({
          region: 'us-east-1',
          credentials: {
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
          }})
        // ReCAPTCHA_Site_Key = process.env.ReCAPTCHA_Site_Key;
      }
    }
  }
