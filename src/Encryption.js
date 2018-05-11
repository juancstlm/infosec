import React from "react"
import {withRouter} from "react-router-dom";
import {TextField} from "ic-snacks";

class Encryption extends React.Component{

  constructor(){
    super()

    this.state = {
      key: 'MyKey',
      AESMessage : '',

    }
  }

  encryptAES(text){
    var CryptoJS = require("crypto-js");

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(text, this.state.key);

    return ciphertext.toString()
  }

  render(){
    return <div>
      <TextField
        floatingLabelText="Key"
        hintText="Enter your decryption key"
        defaultValue = 'MyKey'
        validations={{ isLength: {min: 0, max: 30}}}
        style={{marginTop: '1rem', marginBottom: '1rem'}}
        onChange = {(model)=>{this.setState({key: model.target.value})}}
      />
      <TextField
        floatingLabelText="AES"
        hintText="Enter text to be encrypted using AES"
        validations={{ isLength: {min: 0, max: 30}}}
        style={{marginTop: '1rem', marginBottom: '1rem'}}
        onChange = {(model)=>{this.setState({AESMessage: this.encryptAES(model.target.value)})}}
      />
      {this.state.AESMessage}
    </div>
  }
}
export default withRouter(Encryption)
