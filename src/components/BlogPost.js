import React from 'react'
import PropTypes from 'prop-types'
import TextEditor from "./TextEditor";
import {DynamoDB} from "aws-sdk/index"; // ES6
import {Button, Grow, Icon} from "ic-snacks";
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import {withRouter, Redirect } from 'react-router'
import {CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';


var html
var poolData
var dynamodb

class BlogPost extends React.Component{
  constructor({match, location, history} ){
    super();

    this.state={
    }

    this.setKeys()

    if(location.state){
      console.log('Valid Post')
      this.state ={
        validPost: null,
        isLoaded: false,
        editMode: false,
        edit: false,

        postid: location.state.postid,
        title: null,
        author: null,
        text: null,
        date: null,
        authorid: null,
        previewimage: null,
        mainimage: null,
      }
      this.getBlogPostData()
      this.getCognitoUser()
    } else {
      console.log('Invalid Post')
      history.push('/')
    }
  }

  getCognitoUser(){
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    //If there is a cognito user then get his data from the DB otherwise do nothing
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          console.log(err);
          return;
        } console.log(session);
      });
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        } else{
          console.console.log(result);
          // result.forEach((attribute) => {
          //           if(attribute.Name === 'email'){
          //               self.setState({user: {...self.state.user , email: attribute.Value}}) // set the email
          //               self.setState({user: {...self.state.user , userId: attribute.Value}}) //set the userId
          //           }
          //       })
        }
      });
    }
  }

  getBlogPostData(){
    var params = {
      Key: {
        'postid': {S: this.state.postid}
      },
      TableName: "infosecblog"
    };

    dynamodb.getItem(params, (err, data)=>{
      if(err){console.log(err);
      }
      else {
        console.log('data', data)
        var delta = JSON.parse(data.Item.text.S)
        this.setState({
          text: delta,
          title: data.Item.title.S,
          author:data.Item.author.S,
          date: data.Item.date.S,
          authorid: data.Item.authorid.S,
          previewimage: data.Item.previewimage.S,
          mainimage: data.Item.mainimage.S,
          isLoaded:true,
        })
        console.log('delta', delta)
        this.renderBlogText(delta)
      }
    })
  }

  updateDelta=(delta)=>{
    console.log('Delta callback ', delta)
    this.renderBlogText(delta)
    this.setState({editMode: false})
  }

  renderTextEditor(){
    // TODO Check that the user is the owner of the post
    if(this.state.isLoaded){
      return  <TextEditor postid={this.state.postid} delta={this.state.text} onSubmit={(delta)=>{this.updateDelta(delta)}}/>
    }
  }

  renderBlogText=(delta)=>{
    var blogText = document.getElementById('blog-text')
    var cfg = {};
    var converter = new QuillDeltaToHtmlConverter(delta.ops, cfg);
    html = converter.convert();
    blogText.innerHTML = html;
  }

  renderButtonBar=()=>{
    if(this.state.editMode){
      return(
        <div className='blog-post-button_bar'>
          <div className='blog-post-button_bar-buton'>
            <Button snacksStyle="secondary" onClick={()=>{this.setState({editMode: false})}}>
              Cancel Edit
            </Button>
          </div>
          <div className='blog-post-button_bar-buton'>
            <Button iconPosition="left" icon={<Icon name="trash" />}
            onClick={()=>{console.log('Delete Post Clicked')}}>
            Delete Post
          </Button>
        </div>
      </div>
    )
  } else{
    return (
      <div className='blog-post-button_bar'>
        <div className='blog-post-button_bar-button'>
          <Button onClick={()=>{this.setState({editMode: true})}}>
            Edit Blog Post
          </Button>
        </div>
      </div>
    )
  }
}

render(){
  const backgroundImage = {
    backgroundImage: `url(${this.state.mainimage})`,
  }
  return(
    <div>
      <div className='blog-post'>
        <div className='blog-post-image' style={backgroundImage}>
          <div className='blog-post-post_details'>
            <div className='blog-post-title'>{this.state.title}</div>
            <div>
              <span className='blog-post-author'>Author: {this.state.author} | </span>
              <span className='blog-post-author'>Published On {this.state.date}</span>
            </div>
          </div>
        </div>
        <div className='blog-post-content'>
          {this.renderButtonBar()}
          <div id='blog-text'>
          </div>
          <hr></hr>
          <div style={{ display: 'flex' }}>
            <Grow in={this.state.editMode} axis='y' >
              {this.renderTextEditor()}
            </Grow>
          </div>
        </div>
      </div>
    </div>
  )
}

setKeys(){
  poolData = require('../credentials').poolData
  dynamodb =  new DynamoDB({
    region: require('../credentials').region,
    credentials: {
      accessKeyId: require('../credentials').accessKeyId,
      secretAccessKey: require('../credentials').secretAccessKey,
    }})
  }

}

export default withRouter(BlogPost)
