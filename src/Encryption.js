import React from "react"
import {withRouter} from "react-router-dom";
import {TextField} from "ic-snacks";
import Panel from './components/Panel'
import './stylesheets/encryption.css'

var CryptoJS = require("crypto-js");

class Encryption extends React.Component{

  constructor(){
    super()

    this.state = {
      aesKey: 'MyKey',
      rc4Key: 'MyKey',
      trippledesKey: 'MyKey',
      ciphertestAES : '',
      ciphertextRC4: '',
      ciphertextTDES: '',
    }
  }

  encryptAES(text){
    var ciphertext = CryptoJS.AES.encrypt(text, this.state.aesKey);
    return ciphertext.toString()
  }

  encryptRC4(text){
    var ciphertext = CryptoJS.RC4.encrypt(text, this.state.rc4Key);
    return ciphertext.toString()
  }

  encryptTDES(text){
    var ciphertext = CryptoJS.TripleDES.encrypt(text, this.state.trippledesKey);
    return ciphertext.toString()
  }

  render(){
    const backgroundImage = {
      backgroundImage: `url(https://cdn-images-1.medium.com/max/2000/1*ukLP0nmM8t3uq43Nk_rqcQ.jpeg)`,
    }
    return <div className='encryption'>
      <div className='blog-post-image' style={backgroundImage}>
        <div className='blog-post-post_details'>
          <div className='blog-post-title'>Encryption / Decryption</div>
        </div>
      </div>
      <Panel title="AES 256 Bit Encryption">
        <div className='encryption_text-fields'>
          <TextField
            floatingLabelText="Key"
            hintText="Enter your decryption key"
            defaultValue = 'MyKey'
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({aesKey: model.target.value})}}
          />
          <TextField
            floatingLabelText="Plaintext"
            hintText="Enter plaintext to be encrypted using AES"
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({ciphertextAES: this.encryptAES(model.target.value)})}}
          />
        </div>
        <div className='encryption_cyphertext'>
          Cipher Text: {this.state.ciphertextAES}
        </div>
      </Panel>
      <Panel title='RC4 Encryption'>
        <div className='encryption_text-fields'>
          <TextField
            floatingLabelText="Key"
            hintText="Enter your decryption key"
            defaultValue = 'MyKey'
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({rc4Key: model.target.value})}}
          />
          <TextField
            floatingLabelText="Plaintext"
            hintText="Enter plaintext to be encrypted using AES"
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({ciphertextRC4: this.encryptRC4(model.target.value)})}}
          />
        </div>
        <div className='encryption_cyphertext'>
          Cipher Text: {this.state.ciphertextRC4}
        </div>
      </Panel>
      <Panel title='Triple DES Encrypton'>
        <div className='encryption_text-fields'>
          <TextField
            floatingLabelText="Key"
            hintText="Enter your decryption key"
            defaultValue = 'MyKey'
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({trippledesKey: model.target.value})}}
          />
          <TextField
            floatingLabelText="Plaintext"
            hintText="Enter plaintext to be encrypted using AES"
            validations={{ isLength: {min: 0, max: 30}}}
            style={{width:'94%', marginBottom:'1.5rem'}}
            onChange = {(model)=>{this.setState({ciphertextTDES: this.encryptTDES(model.target.value)})}}
          />
        </div>
        <div className='encryption_cyphertext'>
          Cipher Text: {this.state.ciphertextTDES}
        </div>
      </Panel>
    </div>
  }
}
export default withRouter(Encryption)
