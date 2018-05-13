import React from 'react';
import Quill from 'quill'
import {Button} from "ic-snacks";
import {DynamoDB} from "aws-sdk";
import PropTypes from 'prop-types';

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
var editor
var options = {
    modules: {
        toolbar: toolbarOptions
    },
    readOnly: false,
        theme: 'snow'
}

var dynamodb

export default class TextEditor extends React.Component{


    constructor(){
        super();
        this.setKeys()
        this.state ={
            editMode: false,
        }
    }

    onSubmit=()=>{
        var delta = editor.getContents()
        var data = JSON.stringify(delta)
        console.log('Submited data',data)

        var params = {
          ExpressionAttributeNames: {
              "#t": "text"
            },
            ExpressionAttributeValues:{
              ':t': {
                S: data
              }
            },
            Key: {
              'postid': {
                S: this.props.postid
              }
            },
            ReturnValues: 'ALL_NEW',
            TableName: "infosecblog",
            UpdateExpression: "SET #t =:t",
        };
        dynamodb.updateItem(params, (err, data)=>{
            if (err){ console.log(err)}
            else {
                this.props.onSubmit(delta)
                console.log('data', data)
            }
        })
    }

    callbackFunction=()=>{
        console.log('callback fired')
    }

    onEditPost=()=>{
        editor.enable(true);
        this.setState({
            editMode: true,
        })
    }

    componentDidMount(){
        editor = new Quill('#editor',options);
            if(this.props.delta){
                editor.setContents(this.props.delta, 'user')
            }
    }


    render(){
        return(
                <div>
                    <div id='toolbar'>
                        <div id='editor'>
                        </div>
                        <div style={{marginTop: '2rem', float:'right'}}>
                            <Button onClick={this.onSubmit}>Save</Button>
                        </div>
                    </div>
                </div>
            )
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

TextEditor.propTypes={
    delta: PropTypes.object,
    onSubmit: PropTypes.func,
}
TextEditor.defaultProps ={

}
