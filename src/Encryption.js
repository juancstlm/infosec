import React from "react";
import { withRouter } from "react-router-dom";
import { TextField } from "ic-snacks";
import Panel from "./components/Panel";
import "./stylesheets/encryption.css";
import {DynamoDB} from "aws-sdk/index"; // ES6
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'

var CryptoJS = require("crypto-js");
var postid = '1526-173239-8806';
var dynamodb
var html

class Encryption extends React.Component {
  constructor() {
    super();
    this.setKeys()
    this.state = {
      aesKey: "MyKey",
      rc4Key: "MyKey",
      trippledesKey: "MyKey",
      ciphertestAES: "",
      ciphertextRC4: "",
      ciphertextTDES: "",
      plaintextAES: "",
      plaintextRC4: "",
      plaintextTDES: "",
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

  encryptAES(text) {
    var ciphertext = CryptoJS.AES.encrypt(text, this.state.aesKey);
    return ciphertext.toString();
  }

  encryptRC4(text) {
    var ciphertext = CryptoJS.RC4.encrypt(text, this.state.rc4Key);
    return ciphertext.toString();
  }

  encryptTDES(text) {
    var ciphertext = CryptoJS.TripleDES.encrypt(text, this.state.trippledesKey);
    return ciphertext.toString();
  }

  decryptAES(text) {
    var bytes = CryptoJS.AES.decrypt(text.toString(), this.state.aesKey);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    // var ciphertext = CryptoJS.AES.decrypt(text, this.state.aesKey);
    return plaintext;
  }

  decryptRC4(text) {
    var bytes = CryptoJS.RC4.decrypt(text.toString(), this.state.rc4Key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }

  decryptTDES(text) {
    var bytes = CryptoJS.TripleDES.decrypt(
      text.toString(),
      this.state.trippledesKey
    );
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
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
      backgroundImage: `url(https://cdn-images-1.medium.com/max/2000/1*ukLP0nmM8t3uq43Nk_rqcQ.jpeg)`
    };
    return (
      <div>
        <div className="blog-post-image" style={backgroundImage}>
          <div className="blog-post-post_details">
            <div className="blog-post-title">Encryption / Decryption</div>
          </div>
        </div>
        <div className="encryption">
          <div id='blog-text'>
          </div>
          <Panel title="AES 256 Bit Encryption / Decryption">
            <div className="encryption_text-fields">
              <TextField
                floatingLabelText="Key"
                hintText="Enter your decryption key"
                value={this.state.aesKey}
                type="text"
                validations={{ isLength: { min: 0, max: 30 } }}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({ aesKey: model.target.value });
                }}
              />
              <TextField
                floatingLabelText="Plaintext"
                hintText="Enter plaintext to be encrypted using AES"
                type="text"
                value={this.state.plaintextAES}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    ciphertextAES: this.encryptAES(model.target.value),
                    plaintextAES: model.target.value
                  });
                }}
              />
              <TextField
                floatingLabelText="Ciphertext"
                value={this.state.ciphertextAES}
                hintText="Enter ciphertext to be decrypted by AES"
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    plaintextAES: this.decryptAES(model.target.value),
                    ciphertextAES: model.target.value
                  });
                }}
              />
            </div>
          </Panel>
          <Panel title="RC4 Encryption">
            <div className="encryption_text-fields">
              <TextField
                floatingLabelText="Key"
                hintText="Enter your decryption key"
                defaultValue="MyKey"
                validations={{ isLength: { min: 0, max: 30 } }}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({ rc4Key: model.target.value });
                }}
              />
              <TextField
                floatingLabelText="Plaintext"
                hintText="Enter plaintext to be encrypted using RC4"
                validations={{ isLength: { min: 0, max: 30 } }}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    ciphertextRC4: this.encryptRC4(model.target.value)
                  });
                }}
              />
              <TextField
                floatingLabelText="Ciphertext"
                value={this.state.ciphertextRC4}
                hintText="Enter ciphertext to be decrypted by RC4"
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    plaintextRC4: this.decryptRC4(model.target.value),
                    ciphertextRC4: model.target.value
                  });
                }}
              />
            </div>
          </Panel>
          <Panel title="Triple DES Encrypton">
            <div className="encryption_text-fields">
              <TextField
                floatingLabelText="Key"
                hintText="Enter your decryption key"
                defaultValue="MyKey"
                validations={{ isLength: { min: 0, max: 30 } }}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({ trippledesKey: model.target.value });
                }}
              />
              <TextField
                floatingLabelText="Plaintext"
                hintText="Enter plaintext to be encrypted using TippleDES"
                validations={{ isLength: { min: 0, max: 30 } }}
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    ciphertextTDES: this.encryptTDES(model.target.value)
                  });
                }}
              />
              <TextField
                floatingLabelText="Ciphertext"
                value={this.state.ciphertextTDES}
                hintText="Enter ciphertext to be decrypted by Tripple DES"
                style={{ width: "94%", marginBottom: "1.5rem" }}
                onChange={model => {
                  this.setState({
                    plaintextTDES: this.decryptTDES(model.target.value),
                    ciphertextTDES: model.target.value
                  });
                }}
              />
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  setKeys(){
    if(process.env.NODE_ENV === 'development'){
      // userPool = new CognitoUserPool(require('../credentials').poolData);
      dynamodb =  new DynamoDB({
        region: 'us-east-1',
        credentials: {
          accessKeyId: require('../credentials').accessKeyId,
          secretAccessKey: require('../credentials').secretAccessKey,
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
export default withRouter(Encryption);
