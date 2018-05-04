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

export default class TextEditor extends React.Component{


    constructor(){
        super();

        this.state ={
            editMode: false,
        }
    }

    onSubmit=()=>{
        var delta = editor.getContents()
        var data = JSON.stringify(delta)
        console.log('Submited data',data)


        //Send to AWS Dynamo DB
        var dynamodb = new DynamoDB({
            region: require('../credentials').region,
            credentials: {
                accessKeyId: require('../credentials').accessKeyId,
                secretAccessKey: require('../credentials').secretAccessKey,
        }})


        var params = {
            Item: {
                "postid": {
                    S: '1'
                },
                'title': {
                    S: 'Behind The Scenes'
                },
                "author": {
                    S: 'Juan Castillo'
                },
                "text": {
                    S: data
                },
                'date': {
                    S: new Date().toUTCString()
                },
                'authorid': {
                    S: 'juancstlm@gmail.com'
                },
                'previewimage': {
                    S: 'https://s3-us-west-1.amazonaws.com/juancastillom.com/post1.jpeg'
                },
                'mainimage': {
                    S: 'https://s3-us-west-1.amazonaws.com/juancastillom.com/post1.jpeg'
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "infosecblog"
        };
        var self = this
        dynamodb.putItem(params, (err, data)=>{
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
}

TextEditor.propTypes={
    delta: PropTypes.object,
    onSubmit: PropTypes.func,
}
TextEditor.defaultProps ={

}