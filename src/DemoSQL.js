import React from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Form } from "ic-snacks";
import AWS from "aws-sdk";
import { ToastContainer, toast } from "react-toastify";
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import "react-toastify/dist/ReactToastify.css";
import './stylesheets/demosql.css'
import {DynamoDB} from "aws-sdk/index"; // ES6

var postid = '1526-172282-7746';
var dynamodb
var lambda
var html

class DemoSQL extends React.Component {
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

	handleSubmitFakeLogIn = (model)=> {
		this.logIn(model.username, model.password);
	};

	logIn = (username, password) => {
		var payLoad = {
			username: username,
			password: password
		};

		var params = {
			FunctionName: "authenticate-sql-injection-demo",
			LogType: "Tail",
			Payload: JSON.stringify(payLoad)
		};
		var self = this;
		lambda.invoke(params, function(err, data) {
			if (err || data.FunctionError) {
				toast.error("ERROR Unable to Authenticate");
			}
			// an error occurred
			else {
				self.setState({ loggedIn: true, username: data.PayLoad });
				console.log("User", data);
				toast.success("Welcome " + data.Payload);
			}
		});
	}

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
			backgroundImage: `url(https://cdn-images-1.medium.com/max/1024/0*ErN7MyOU7wjQLSgM.jpg)`
		};
		return (
			<div>
				<div className="blog-post-image" style={backgroundImage}>
					<div className="blog-post-post_details">
						<div className="blog-post-title">
							SQL Injection
						</div>
					</div>
				</div>
				<div className='demosql'>
					<img style={{width: '100%'}} data-src="https://cdn-images-1.medium.com/max/800/1*P4nj9fJjSeJ9-c0rwSZqlg.png" src="https://cdn-images-1.medium.com/max/800/1*P4nj9fJjSeJ9-c0rwSZqlg.png"/>
					<div id='blog-text'>
					</div>
					<div className='demosql_log-in-form'>
						<Form onSubmit={this.handleSubmitFakeLogIn}>
							<TextField
								floatingLabelText="Username"
								name="username"
								required
								hintText="Enter your Username"
								validations={{ isLength: { min: 0, max: 45 } }}
								style={{ width: "94%", marginBottom: "1.5rem" }}
							/>
							<TextField
								floatingLabelText="Password"
								name="password"
								required
								hintText="Enter your password"
								validations={{ isLength: { min: 0, max: 45 } }}
								style={{ width: "94%", marginBottom: "1.5rem" }}
							/>
							<Button
								type="submit"
								snacksStyle="primary"
								size="standard"
							>
								Log In
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
				lambda = new AWS.Lambda({
					region: "us-west-1",
					credentials: {
						accessKeyId: require("./credentials").accessKeyId,
						secretAccessKey: require("./credentials").secretAccessKey
					}
				});
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
				lambda = new AWS.Lambda({
						region: "us-west-1",
						credentials: {
							accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
							secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
						}
					});
        // ReCAPTCHA_Site_Key = process.env.ReCAPTCHA_Site_Key;
      }
    }
}

export default withRouter(DemoSQL);
