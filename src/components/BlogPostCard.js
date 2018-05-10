import React from 'react'
import PropTypes from 'prop-types';
import {DynamoDB} from "aws-sdk/index"; // ES6
import {withRouter} from "react-router-dom";

class BlogPostCard extends React.Component{
    constructor(){
        super()

        this.state = {
            previewimage: null,
            title: null,
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
                ProjectionExpression: 'postid, previewimage, title',
                TableName: "infosecblog"
            };

            dynamodb.getItem(params, (err, data)=>{
                if(err){console.log(err)}
                else {
                    console.log(data)
                    this.setState({
                        title: data.Item.title.S,
                        previewimage: data.Item.previewimage.S,
                        isLoaded:true,
                    })
                }
            })
    }

    handleClick=()=>{
      const location = {
        pathname: '/blogpost/' + this.props.postid,
        state: { postid: this.props.postid}
      }
      this.props.history.push(location)
      console.log('Card clicked')
    }

    render(){
        const backgroundImage = {
            backgroundImage: `url(${this.state.previewimage})`,
        }
        return(
            <div className='blog_post_card' style={backgroundImage}
              onClick={this.handleClick}>
                <div className='blog_post_card-content'>
                    <div className='blog_post_card-title'>{this.state.title}</div>
                </div>
            </div>
        )
    }
}
export default withRouter(BlogPostCard)

BlogPostCard.propTypes={
    postid: PropTypes.string,
}
