import React from 'react'
import PropTypes from 'prop-types';
import Header from "./Header";
import Footer from "./Footer";
import TextEditor from "./TextEditor";
import {DynamoDB} from "aws-sdk/index"; // ES6
import {Button, Grow} from "ic-snacks";
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'

var html

export default class BlogPost extends React.Component{
    constructor(){
        super();

        this.state ={
            isLoaded: false,

            editMode: false,

            edit: false,
            title: null,
            author: null,
            text: null,
            date: null,
            authorid: null,
            previewimage: null,
            mainimage: null,
        }
    }

    componentDidMount(){
        this.getBlogPostData()
    }

    getBlogPostData(){
        var dynamodb = new DynamoDB({
            region: require('../credentials').region,
            credentials: {
                accessKeyId: require('../credentials').accessKeyId,
                secretAccessKey: require('../credentials').secretAccessKey,
            }})
            var params = {
                Key: {
                    'postid': {S: this.props.postid}
                },
                TableName: "infosecblog"
            };
    
            dynamodb.getItem(params, (err, data)=>{
                if(err){console.log(err)}
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

    updateDelta=(delta)=>{
        console.log('Delta callback ', delta)
        this.renderBlogText(delta)
        this.setState({editMode: false})
    }

    renderTextEditor(){
        // TODO Check that the user is the owner of the post 
        if(this.state.isLoaded){
            return  <TextEditor delta={this.state.text} onSubmit={(delta)=>{this.updateDelta(delta)}}/>
        }
    }

    renderBlogText=(delta)=>{
        var blogText = document.getElementById('blog-text')
        var cfg = {};
        var converter = new QuillDeltaToHtmlConverter(delta.ops, cfg);
        html = converter.convert();
        blogText.innerHTML = html;
    }

    render(){


        const backgroundImage = {
            backgroundImage: `url(${this.state.mainimage})`,
        }

        return(
            <div>
                <Header/>
                <div className='blog-post'>
                    <div className='blog-post-image' style={backgroundImage}>
                        <div className='blog-post-post_details'>
                            <div className='blog-post-title'>{this.state.title}</div>
                            <div>
                                <span className='blog-post-author'>Author: {this.state.author} | </span>
                                <span className='blog-post-author'>Published On {this.state.date}</span>
                            </div>
                    </div>
                </div>
                    <div className='blog-post-content'>
                        <div>
                            <Button onClick={()=>{this.setState({editMode: true}); console.log(this.state)}}>
                            Edit Blog Post
                            </Button>
                        </div>
                        <div id='blog-text'>
                        </div>
                    <Grow in={this.state.editMode} axis='y' >
                        {this.renderTextEditor()}
                    </Grow>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

BlogPost.propTypes ={
    postid: PropTypes.string,
}
BlogPost.defaultProps ={
    postid: '1'
}