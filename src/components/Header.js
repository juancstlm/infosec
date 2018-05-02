import React from "react"
import {withRouter} from "react-router-dom";
import {Button, DropdownMenu, Form, Icon, MenuItem, Slide, TextField} from "ic-snacks";
import {Modal} from "react-bootstrap";
import ReCAPTCHA  from 'react-google-recaptcha'


import '../stylesheets/header.css'

class Header extends React.Component{

    constructor(){
        super();

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            signUpModal: false,
            signInModal: false,

            //CAPTCHA
            isNotRobot: true, //assume everyone is a robot until proven otherwise

            singUpSuccess: false,

            email: null,
        }
    }

    handleShowModal= (e, model) =>{
        if(model.value === 'signUp'){
            this.setState({
                signUpModal: true,
            })
        } else {
            this.setState({
                signInModal: true,
            })
        }
    }

    //Closes all the modals
    handleClose(){this.setState({signUpModal: false, signInModal: false,})};

    handleSignIn =(model)=>{

        let AmazonCognitoIdentity = require('amazon-cognito-identity-js');

        let authenticationData = {
            Username: model.email,
            Password: model.password,
        };
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        var poolData = require('../credentials').poolData;

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var userData = {
            Username : model.email,
            Pool : userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
            },

            onFailure: function(err) {
                alert(err.message)
            },

        });
    }

    handleSignUp = (model) =>{
        let AmazonCognitoIdentity = require('amazon-cognito-identity-js');

        var attributeList = [];

        var poolData = require('../credentials').poolData;
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var dataEmail = {
            Name : 'email',
            Value : model.email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        let self =this
        userPool.signUp(model.email, model.password, attributeList, null, function(err, result) {
            if (err) {
                alert(err.message)
                return;
            }
            self.setState({
                singUpSuccess: true,
            })
            console.log('Success ', result)
        });
    }

    handleConfirmation= (model) =>{
        let AmazonCognitoIdentity = require('amazon-cognito-identity-js');
        var poolData = require('../credentials').poolData;
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username : this.state.email,
            Pool : userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.confirmRegistration(model.confirmation, true, function(err, result) {

            if (err) {
                alert(err.message);
                return;
            }

            alert("Confirmed user")
            //TODO sign the user in
        });
    }

    onValidCAPTCHA=(value)=>{
        console.log(value)
        this.setState({
            isNotRobot: true
        })
    }

    // This modal gets shown when the user wants to sign in
    signInModal(){
        return <div>
                <Modal show={this.state.signInModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <h2>Sign In</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Form formProps={{id:'singInForm'}} onSubmit={this.handleSignIn}>
                            <TextField
                                floatingLabelText="Email"
                                name="email"
                                type="email"
                                hintText="johnappleseed@me.com"
                                validations={{isEmail: null, isLength: {min: 3, max: 30}}}
                                validationErrorText="Sorry, please enter a valid email."
                                required
                                style={{marginTop: '1rem', marginBottom: '1rem'}}
                            />
                            <TextField
                                floatingLabelText="Password"
                                name="password"
                                type="password"
                                hintText="min. 8 characters"
                                validations={{isLength: {min: 8, max: 64}}}
                                validationErrorText="Sorry, password must be min. 8 characters."
                                required
                                style={{marginTop: '1rem', marginBottom: '1rem'}}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{textAlign: 'center'}}>
                            <Button elementAttributes={{form:"singInForm"}} type="submit">
                                Log In
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
    }

    renderSignUpModalBody(){
        if(this.state.singUpSuccess){
            return (
                <Slide in={this.state.singUpSuccess} offset={ 42}>
                    <Form onSubmit={this.handleConfirmation}>
                        <TextField
                            floatingLabelText="Confirmation Code"
                            name="confirmation"
                            type="text"
                            hintText=""
                            validations={{isLength: {min: 6, max: 6}}}
                            validationErrorText="Confirmation code is 6 numbers"
                            required
                        />
                    </Form>
                </Slide>
            )
        } else {
            return (
                <Form  formProps={{id:'singUpForm'}} onSubmit={this.handleSignUp}>
                    <div style={{textAlign:'center'}}>
                        <TextField
                            floatingLabelText="First Name"
                            name="firstName"
                            type="firstName"
                            style={{marginTop: '1rem', marginBottom: '1rem'}}
                            required
                        />
                        <TextField
                            floatingLabelText="Last Name"
                            name="lastName"
                            type="lastName"
                            hintText=""
                            required
                            style={{marginTop: '1rem', marginBottom: '1rem'}}
                        />
                        <TextField
                            floatingLabelText="Email"
                            name="email"
                            type="email"
                            hintText="johnappleseed@me.com"
                            validations={{isEmail: null, isLength: {min: 3, max: 30}}}
                            validationErrorText="Sorry, please enter a valid email."
                            required
                            onChange={(model)=>{this.setState({email: model.target.value})}}
                            style={{marginTop: '1rem', marginBottom: '1rem'}}
                        />
                        <TextField
                            floatingLabelText="Password"
                            name="password"
                            type="password"
                            hintText="min. 8 characters"
                            validations={{isLength: {min: 8, max: 64}}}
                            validationErrorText="Sorry, password must be min. 8 characters."
                            required
                            style={{marginTop: '1rem', marginBottom: '1rem'}}
                        />
                    </div>
                </Form>
            )
        }
    }

    signUpModal(){
        return <div>
            <Modal show={this.state.signUpModal} onHide={this.handleClose} cl>
                <Modal.Header>
                    <h2>Sign Up</h2>
                </Modal.Header>
                <Modal.Body>
                    {this.renderSignUpModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    {this.renderSignUpModalFooter()}
                </Modal.Footer>
            </Modal>
        </div>
    }

    renderSignUpModalFooter = ()=>{
        if(this.state.singUpSuccess){
            return (
                <Button type="submit" elementAttributes={{form:"confirmForm"}}>
                    Submit
                </Button>
            )
        } else {
            return (
                <div>
                    <div>
                        <ReCAPTCHA
                            theme='dark'
                            ref="recaptcha"
                            sitekey="6Lczr1YUAAAAAFCJikwxFiQi1wxJ8Pwm31-JL9gn"
                            onChange={this.onValidCAPTCHA}
                        />
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <Button type="submit" disabled={!this.state.isNotRobot} elementAttributes={{form:"singUpForm"}}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            )
        }
    }

    render(){
        return(
            <div className="header">
                <span className='header-title' onClick={()=>this.props.history.push('./')}>Information Security</span>
                <div className='header-authenticate'>
                    <DropdownMenu onSelect={this.handleShowModal}
                        triggerElement={<Button inverted snacksStyle="secondary" size="standard">
                            <Icon name='iconPerson'></Icon>
                        </Button>}>
                        <MenuItem label="Sign In" value="signIn" style={{color: '#2F3A49'}}
                                  onClick={this.handleShowSignInModal}/>
                        <MenuItem label="Sign Up" value="signUp" style={{color: '#2F3A49'}}/>
                    </DropdownMenu>
                </div>
                {this.signInModal()}
                {this.signUpModal()}
            </div>
        )
    }
}

export default withRouter(Header)