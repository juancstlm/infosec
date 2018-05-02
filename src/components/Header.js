import React from "react"
import {withRouter} from "react-router-dom";
import {Button, DropdownMenu, Form, Icon, MenuItem, TextField} from "ic-snacks";
import {Modal} from "react-bootstrap";
import ReCAPTCHA  from 'react-google-recaptcha'
import AmazonCognitoIdentity from 'amazon-cognito-identity-js'

import '../stylesheets/header.css'

class Header extends React.Component{

    constructor(){
        super();

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            signUpModal: false,
            signInModal: false,

            //CAPTCHA
            isNotRobot: false, //assume everyone is a robot until proven otherwise
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

    handleSignIn =(model)=>{

        let authenticationData = {
            Username: model.email,
            Password: model.password,
        };
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        var poolData;
    }

    onValidCAPTCHA=(value)=>{
        console.log(value)
        this.setState({
            isNotRobot: true
        })
    }

    handleClose(){this.setState({signUpModal: false, signInModal: false,})};

    signInModal(){
        return <div>
                <Modal show={this.state.signInModal} onHide={this.handleClose}>
                    <Modal.Header>
                        <h2>Sign In</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <TextField
                                floatingLabelText="Email"
                                name="email"
                                type="email"
                                hintText="johnappleseed@me.com"
                                validations={{isEmail: null, isLength: {min: 3, max: 30}}}
                                validationErrorText="Sorry, please enter a valid email."
                                required
                            />
                            <TextField
                                floatingLabelText="Password"
                                name="password"
                                type="password"
                                hintText="min. 8 characters"
                                validations={{isLength: {min: 8, max: 64}}}
                                validationErrorText="Sorry, password must be min. 8 characters."
                                required
                            />
                            <Button type="submit" style={{margin: '6% 15% 3% 15%', width: '70%', height:'2.2em'}} >
                                Log In
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
    }

    signUpModal(){
        return <div>
            <Modal show={this.state.signUpModal} onHide={this.handleClose} cl>
                <Modal.Header>
                    <h2>Sign Up</h2>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div style={{textAlign:'center'}}>
                        <TextField
                            floatingLabelText="First Name"
                            name="firstName"
                            type="firstName"
                            hintText="sdasd"
                            required
                        />
                        <TextField
                            floatingLabelText="Last Name"
                            name="lastName"
                            type="lastName"
                            hintText=""
                            required
                        />
                        <TextField
                            floatingLabelText="Email"
                            name="email"
                            type="email"
                            hintText="johnappleseed@me.com"
                            validations={{isEmail: null, isLength: {min: 3, max: 30}}}
                            validationErrorText="Sorry, please enter a valid email."
                            required
                        />
                        <TextField
                            floatingLabelText="Password"
                            name="password"
                            type="password"
                            hintText="min. 8 characters"
                            validations={{isLength: {min: 8, max: 64}}}
                            validationErrorText="Sorry, password must be min. 8 characters."
                            required
                        />
                    </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <ReCAPTCHA
                            theme='dark'
                            ref="recaptcha"
                            sitekey="6Lczr1YUAAAAAFCJikwxFiQi1wxJ8Pwm31-JL9gn"
                            onChange={this.onValidCAPTCHA}
                        />
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <Button type="submit" disabled={!this.state.isNotRobot} >
                            Sign Up
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    }

    render(){
        return(
            <div className="header">
                <span className='header-title'>Information Security</span>
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