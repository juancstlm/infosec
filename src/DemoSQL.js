import React from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Form } from "ic-snacks";
import Panel from "./components/Panel";
import AWS from "aws-sdk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './stylesheets/demosql.css'

var postid = '1526-172282-7746';

class DemoSQL extends React.Component {
	constructor() {
		super();

		this.state = {
			username: "",
			loggedIn: false
		};
	}

	handleSubmitFakeLogIn = (model)=> {
		this.logIn(model.username, model.password);
	};

	logIn = (username, password) => {
		var lambda = new AWS.Lambda({
			region: "us-west-1",
			credentials: {
				accessKeyId: require("./credentials").accessKeyId,
				secretAccessKey: require("./credentials").secretAccessKey
			}
		});
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
	};

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

					<div>Content Goes Here</div>
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
}

export default withRouter(DemoSQL);
