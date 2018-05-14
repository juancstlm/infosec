import React from 'react'
import TextEditor from "./TextEditor";
import {DynamoDB} from "aws-sdk/index"; // ES6
import {Button, Grow, Icon} from "ic-snacks";
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import {withRouter } from 'react-router'
import {CognitoUserPool} from 'amazon-cognito-identity-js';


var html
var userPool
var dynamodb
var cognitoUser

class BlogPost extends React.Component{
  constructor({match, location, history} ){
    super();

    this.state={
    }

    this.setKeys()

    if(location.state){
      console.log('Valid Post')
      this.state ={
        isAuthor: false, // Is the current user the author of the post
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

  componentDidMount(){

  }

  getCognitoUser(){
    // Attempt to get the current user from session storage
    cognitoUser = userPool.getCurrentUser()
    var self = this // Necessary since closure has no acces to this
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session)=> {
        if (err) {
          // TODO use react notifications instead of alert
          console.log(err);
          return;
        }
        console.log('Blog post session validity: ' + session.isValid());
        self.userAuthenticate()
      });
    }
  }

  userAuthenticate = ()=>{
    var self = this
    var i
    cognitoUser.getUserAttributes((err, result)=> {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      for (i = 0; i < result.length; i++) {
        if(result[i].getName() === 'email'){
          if(this.state.authorid === result[i].getValue()){
            self.setState({
              isAuthor: true
            })
          } else {
            console.log('User is not the author of this post');
          }
        }
        else if(result[i].getName() === 'custom:administrator'){
          if(result[i].getValue() === '1'){
            self.setState({
              isAuthor: true
            })
          }
          else {
            console.log('User is not an admin');
          }
        }
      }
    })
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

  handleDeletePost = ()=>{
    var params = {
      Key:{
        'postid': {
          S: this.state.postid
        }
      },
      TableName: 'infosecblog'
    }

    var self = this
    dynamodb.deleteItem(params, (err,data)=>{
      if(err) console.log(err, err.stack)
      else {
        self.props.history.push('/')
      }
    })
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
            onClick={this.handleDeletePost}>
            Delete Post
          </Button>
        </div>
      </div>
    )
  } else{
    if(this.state.isAuthor){
      return (
        <div className='blog-post-button_bar'>
          <div className='blog-post-button_bar-button'>
            <Button onClick={()=>{this.setState({editMode: true})}}>
              Edit Blog Post
            </Button>
          </div>
        </div>
      )
    } else{
      return <div></div>
    }
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
  if(process.env.NODE_ENV === 'development' || true){
    userPool = new CognitoUserPool(require('../credentials').poolData);
    dynamodb =  new DynamoDB({
      region: 'us-east-1',
      credentials: {
        accessKeyId: require('../credentials').accessKeyId,
        secretAccessKey: require('../credentials').secretAccessKey,
      }})
    }
    else {
      userPool = new CognitoUserPool({
          UserPoolId : process.env.UserPoolId,
          ClientId : process.env.ClientId
      })
      dynamodb = new DynamoDB({
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.accessKeyId,
          secretAccessKey: process.env.secretAccessKey
        }})
    }
  }
}

export default withRouter(BlogPost)
