import React from "react";
import { withRouter } from "react-router-dom";
import { Button, TextField, Form } from "ic-snacks";
import Panel from "./components/Panel";
import AWS from "aws-sdk";

class DemoSQL extends React.Component {
	constructor() {
		super();
	}

	handleSubmitFakeLogIn = (model) => {
		this.logIn(model.username, model.password)
	};

	logIn=(username, password)=> {
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
		lambda.invoke(params, function(err, data) {
			if (err) console.log(err, err.stack);
			// an error occurred
			else {
				console.log("Data from lambda", data);
			}
		});
	}

	render() {
		const backgroundImage = {
			backgroundImage: `url(https://cdn-images-1.medium.com/max/2000/1*ukLP0nmM8t3uq43Nk_rqcQ.jpeg)`
		};
		return (
			<div>
				<div className="blog-post-image" style={backgroundImage}>
					<div className="blog-post-post_details">
						<div className="blog-post-title">
							Encryption / Decryption
						</div>
					</div>
				</div>
				<div>
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
						<Button type='submit' snacksStyle="primary" size="standard">
						Log In
						</Button>
					</Form>
				</div>
				SQL Injection
			</div>
		);
	}
}

export default withRouter(DemoSQL);
