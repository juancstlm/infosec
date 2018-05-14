import React from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Form } from "ic-snacks";
import Panel from "./components/Panel";
import AWS from "aws-sdk";
import { ToastContainer, toast } from "react-toastify";
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import "react-toastify/dist/ReactToastify.css";
import './stylesheets/demosql.css'
import {DynamoDB} from "aws-sdk/index"; // ES6

var postid = '1526-268861-1917';
var dynamodb
var html

class DemoXSS extends React.Component {
	constructor() {
		super();
		this.setKeys()
		this.state = {
			username: "",
			loggedIn: false,

			//BLog post data
				text: null,
				title: null,
				author:null,
				date: null,
				authorid: null,
				previewimage: null,
				mainimage: null,
		};

		this.getBlogPostData()
	}

	handleSubmitXSS = (model)=> {
		const location = {
			pathname: '/fakeblogpost/' + model.title,
			state: { postTitle: model.title,
							author: model.author}
		}
		this.props.history.push(location)
	};

	getBlogPostData(){
    var params = {
      Key: {
        'postid': {S: postid}
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

	renderBlogText=(delta)=>{
    var blogText = document.getElementById('blog-text')
    var cfg = {};
    var converter = new QuillDeltaToHtmlConverter(delta.ops, cfg);
    html = converter.convert();
    blogText.innerHTML = html;
  }

	render() {
		const backgroundImage = {
			backgroundImage: `url(https://cdn-images-1.medium.com/max/1500/1*JN5atqW0tbV9y0JYFtb32Q.jpeg)`
		};
		return (
			<div>
				<div className="blog-post-image" style={backgroundImage}>
					<div className="blog-post-post_details">
						<div className="blog-post-title">
							Cross Site Scripting
						</div>
					</div>
				</div>
				<div className='demosql'>
					<div id='blog-text'>
					</div>
					<div className='demosql_log-in-form'>
						<h2>Create A New Fake New Post</h2>
						<Form onSubmit={this.handleSubmitXSS}>
							<TextField
								floatingLabelText="Blog Title"
								name="title"
								required
								hintText="Enter the blog title"
								style={{ width: "94%", marginBottom: "1.5rem" }}
							/>
							<TextField
								floatingLabelText="Author"
								name="author"
								required
								hintText="Enter the blog author"
								style={{ width: "94%", marginBottom: "1.5rem" }}
							/>
							<Button
								type="submit"
								snacksStyle="primary"
								size="standard"
							>
								Create Blog Post
							</Button>
						</Form>
					</div>
				</div>
				<ToastContainer />
			</div>
		);
	}

	setKeys(){
    if(process.env.NODE_ENV === 'development'){
      // userPool = new CognitoUserPool(require('./credentials').poolData);
      dynamodb =  new DynamoDB({
        region: 'us-east-1',
        credentials: {
          accessKeyId: require('./credentials').accessKeyId,
          secretAccessKey: require('./credentials').secretAccessKey,
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
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey
          }})
        // ReCAPTCHA_Site_Key = process.env.ReCAPTCHA_Site_Key;
      }
    }
}

export default withRouter(DemoXSS);
