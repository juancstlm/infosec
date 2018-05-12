import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import {
  Button,
  DropdownMenu,
  Form,
  Icon,
  MenuItem,
  MenuDivider,
  Slide,
  TextField
} from "ic-snacks";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import { DynamoDB } from "aws-sdk";

import "../stylesheets/header.css";

// AWS Variables
var userPool;
var cognitoUser;
var dynamodb;

// ReCAPTCHA
var ReCAPTCHA_Site_Key;

class Header extends React.Component {
  constructor() {
    super();

    this.setKeys();
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      isSignedIn: false,
      signUpModal: false,
      signInModal: false,
      newPostModal: false,

      //CAPTCHA //TODO change to false for release
      isNotRobot: true, //assume everyone is a robot until proven otherwise

      singUpSuccess: false,

      email: null,
      username: ""
    };

    // Attempts to get the current cognito user
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  handleShowModal = (e, model) => {
    if (model.value === "signUp") {
      this.setState({
        signUpModal: true
      });
    } else {
      this.setState({
        signInModal: true
      });
    }
  };

  handleUserActions = (e, model) => {
    //TODO handle sign out and new post
    if (model.value === "newPost") {
      this.setState({
        newPostModal: true
      });
    } else if (model.value === "signOut") {
      this.handleSignOut();
    }
  };

  //Closes all the modals
  handleClose() {
    this.setState({
      signUpModal: false,
      signInModal: false,
      newPostModal: false
    });
  }

  getCurrentUser = () => {
    // Attempt to get the current user from session storage
    cognitoUser = userPool.getCurrentUser();
    var self = this; // Necessary since closure has no acces to this
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          // TODO use react notifications instead of alert
          alert(err);
          return;
        }
        self.getCognitoUserAttributes(); // Get the cognito user attribues
        console.log("session validity: " + session.isValid());
      });
    }
  };

  // Handle when a user submits the sign in form
  handleSignIn = model => {
    let authenticationData = {
      Username: model.email,
      Password: model.password
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    var userData = {
      Username: model.email,
      Pool: userPool
    };

    let self = this;
    cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        console.log("access token + " + result.getAccessToken().getJwtToken());
        self.getCognitoUserAttributes();
        self.handleClose();
      },
      onFailure: function(err) {
        console.log("Authentication error", err.message);
      }
    });
  };

  // Gets the conito user's attributes
  getCognitoUserAttributes = () => {
    // set the log in state to true
    this.setState({
      isSignedIn: true
    });
    // Necessary becuase the closure has no access to this.state
    let self = this;
    var i;
    cognitoUser.getUserAttributes(function(err, result) {
      if (err) {
        alert(err);
        return;
      }
      for (i = 0; i < result.length; i++) {
        // TODO Set the cognito user attribuets in the state
        console.log(
          "attribute " +
            result[i].getName() +
            " has value " +
            result[i].getValue()
        );
        if (result[i].getName() === "name") {
          self.setState({ username: result[i].getValue() });
        } else if (result[i].getName() === "email") {
          self.setState({ email: result[i].getValue() });
        }
      }
    });
  };

  handleSignUp = model => {
    var attributeList = [];

    var dataEmail = {
      Name: "email",
      Value: model.email
    };

    var dataName = {
      Name: "name",
      Value: model.firstName + " " + model.lastName
    };
    var dataAdmin = {
      Name: "custom:administrator",
      Value: "0"
    };

    var attributeEmail = new CognitoUserAttribute(dataEmail);
    var attributeName = new CognitoUserAttribute(dataName);
    var attributeAdmin = new CognitoUserAttribute(dataAdmin);
    attributeList.push(attributeEmail);
    attributeList.push(attributeName);
    attributeList.push(attributeAdmin);

    let self = this;
    userPool.signUp(model.email, model.password, attributeList, null, function(
      err,
      result
    ) {
      if (err) {
        alert(err.message);
        return;
      }
      self.setState({
        singUpSuccess: true
      });
      console.log("Success ", result);
    });
  };

  handleConfirmation = model => {
    var userData = {
      Username: this.state.email,
      Pool: userPool
    };

    cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(model.confirmation, true, function(
      err,
      result
    ) {
      if (err) {
        alert(err.message);
        return;
      }
      this.handleClose();

      alert("Confirmed user");
    });
  };

  onValidCAPTCHA = value => {
    console.log(value);
    this.setState({
      isNotRobot: true
    });
  };

  handleSignOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      var cognitoUser = userPool.getCurrentUser();
      cognitoUser.signOut();
      window.location.reload();
    } else {
      console.log("cancel");
    }
  };

  handleNewPost = model => {
    var postid = this.createPostID();

    var params = {
      Item: {
        postid: {
          S: postid
        },
        title: {
          S: model.title
        },
        author: {
          S: this.state.username
        },
        text: {
          S: '{"ops":[]}'
        },
        date: {
          S: new Date().toUTCString()
        },
        authorid: {
          S: this.state.email
        },
        previewimage: {
          S: "https://s3-us-west-1.amazonaws.com/juancastillom.com/post1.jpeg"
        },
        mainimage: {
          S: "https://s3-us-west-1.amazonaws.com/juancastillom.com/post1.jpeg"
        }
      },
      ReturnConsumedCapacity: "TOTAL",
      TableName: "infosecblog"
    };
    dynamodb.putItem(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        this.handleClose();
        const location = {
          pathname: "/blogpost/" + postid,
          state: { postid: postid }
        };
        this.props.history.push(location);
        console.log("new Post Model", model);
        console.log("data", data);
      }
    });
  };

  // This modal gets shown when the user wants to sign in
  signInModal() {
    return (
      <div>
        <Modal show={this.state.signInModal} onHide={this.handleClose}>
          <Modal.Header>
            <h2>Sign In</h2>
          </Modal.Header>
          <Modal.Body>
            <Form formProps={{ id: "singInForm" }} onSubmit={this.handleSignIn}>
              <TextField
                floatingLabelText="Email"
                name="email"
                type="email"
                hintText="johnappleseed@me.com"
                validations={{ isEmail: null, isLength: { min: 3, max: 30 } }}
                validationErrorText="Sorry, please enter a valid email."
                required
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              />
              <TextField
                floatingLabelText="Password"
                name="password"
                type="password"
                hintText="min. 8 characters"
                validations={{ isLength: { min: 8, max: 64 } }}
                validationErrorText="Sorry, password must be min. 8 characters."
                required
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ textAlign: "center" }}>
              <Button elementAttributes={{ form: "singInForm" }} type="submit">
                Log In
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  renderSignUpModalBody() {
    if (this.state.singUpSuccess) {
      return (
        <Slide in={this.state.singUpSuccess} offset={42}>
          <Form
            onSubmit={this.handleConfirmation}
            formProps={{ id: "confirmForm" }}
          >
            <TextField
              floatingLabelText="Confirmation Code"
              name="confirmation"
              type="text"
              hintText=""
              validations={{ isLength: { min: 6, max: 6 } }}
              validationErrorText="Confirmation code is 6 numbers"
              required
            />
          </Form>
        </Slide>
      );
    } else {
      return (
        <Form formProps={{ id: "singUpForm" }} onSubmit={this.handleSignUp}>
          <div style={{ textAlign: "center" }}>
            <TextField
              floatingLabelText="First Name"
              name="firstName"
              type="firstName"
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
              required
            />
            <TextField
              floatingLabelText="Last Name"
              name="lastName"
              type="lastName"
              hintText=""
              required
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            />
            <TextField
              floatingLabelText="Email"
              name="email"
              type="email"
              hintText="johnappleseed@me.com"
              validations={{ isEmail: null, isLength: { min: 3, max: 30 } }}
              validationErrorText="Sorry, please enter a valid email."
              required
              onChange={model => {
                this.setState({ email: model.target.value });
              }}
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            />
            <TextField
              floatingLabelText="Password"
              name="password"
              type="password"
              hintText="min. 8 characters"
              validations={{ isLength: { min: 8, max: 64 } }}
              validationErrorText="Sorry, password must be min. 8 characters."
              required
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            />
          </div>
        </Form>
      );
    }
  }

  signUpModal() {
    return (
      <div>
        <Modal show={this.state.signUpModal} onHide={this.handleClose} cl>
          <Modal.Header>
            <h2>Sign Up</h2>
          </Modal.Header>
          <Modal.Body>{this.renderSignUpModalBody()}</Modal.Body>
          <Modal.Footer>{this.renderSignUpModalFooter()}</Modal.Footer>
        </Modal>
      </div>
    );
  }

  newPostModal() {
    return (
      <div>
        <Modal show={this.state.newPostModal} onHide={this.handleClose} cl>
          <Modal.Header>
            <h2>New Blog Post</h2>
          </Modal.Header>
          <Modal.Body>
            <Form
              formProps={{ id: "newPostForm" }}
              onSubmit={this.handleNewPost}
            >
              <div style={{ textAlign: "center" }}>
                <TextField
                  floatingLabelText="Blog Post Title"
                  name="title"
                  type="text"
                  style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  required
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div style={{ textAlign: "center" }}>
              <Button type="submit" elementAttributes={{ form: "newPostForm" }}>
                Create Post
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  renderSignUpModalFooter = () => {
    if (this.state.singUpSuccess) {
      return (
        <Button type="submit" elementAttributes={{ form: "confirmForm" }}>
          Submit
        </Button>
      );
    } else {
      return (
        <div>
          <div>
            <ReCAPTCHA
              theme="dark"
              ref="recaptcha"
              sitekey={ReCAPTCHA_Site_Key}
              onChange={this.onValidCAPTCHA}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              disabled={!this.state.isNotRobot}
              elementAttributes={{ form: "singUpForm" }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      );
    }
  };
  renderDropdownMenu() {
    if (this.state.isSignedIn) {
      return (
        <DropdownMenu
          onSelect={this.handleUserActions}
          triggerElement={
            <Button
              inverted
              size="standard"
              iconPosition="left"
              icon={<Icon name="iconPerson" />}
            >
              Welcome {this.state.username}
            </Button>
          }
        >
          <MenuItem
            label="New Blog Post"
            value="newPost"
            style={{ color: "#2F3A49" }}
          />
          <MenuDivider />
          <MenuItem
            label="Sign Out"
            value="signOut"
            style={{ color: "#2F3A49" }}
          />
        </DropdownMenu>
      );
    } else {
      return (
        <DropdownMenu
          onSelect={this.handleShowModal}
          triggerElement={
            <Button inverted snacksStyle="secondary" size="standard">
              <Icon name="iconPerson" />
            </Button>
          }
        >
          <MenuItem
            label="Sign In"
            value="signIn"
            style={{ color: "#2F3A49" }}
            onClick={this.handleShowSignInModal}
          />
          <MenuItem
            label="Sign Up"
            value="signUp"
            style={{ color: "#2F3A49" }}
          />
        </DropdownMenu>
      );
    }
  }

  render() {
    return (
      <div className="header">
        <div
          className="header-title"
          onClick={() => this.props.history.push("/")}
        >
          Information Security
        </div>
        <div className="header-authenticate">{this.renderDropdownMenu()}</div>
        <div className='header-navigation'>
        <NavLink
        to="/encryption"
        activeClassName="header-nav_link-selected"
        >Encryption</NavLink>
        </div>
        {this.signInModal()}
        {this.signUpModal()}
        {this.newPostModal()}
      </div>
    );
  }

  setKeys() {
    userPool = new CognitoUserPool(require("../credentials").poolData);
    ReCAPTCHA_Site_Key = require("../credentials").ReCAPTCHA_Site_Key;
    dynamodb = new DynamoDB({
      region: require("../credentials").region,
      credentials: {
        accessKeyId: require("../credentials").accessKeyId,
        secretAccessKey: require("../credentials").secretAccessKey
      }
    });
  }

  createPostID() {
    let now = Date.now().toString();
    if (now.length < 14) {
      const pad = 14 - now.length;
      now += Math.floor(
        Math.pow(10, pad - 1) +
          Math.random() * (Math.pow(10, pad) - Math.pow(10, pad - 1) - 1)
      );
    }
    return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
  }
}

export default withRouter(Header);
