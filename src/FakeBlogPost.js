import React from 'react'
import {withRouter } from 'react-router'

class FakeBlogPost extends React.Component{

  constructor({match, location, history} ){
    super();

    console.log(location);
    console.log(match);
    console.log(history);
      this.state ={
        html: location.state.postTitle,
        author: location.state.author
      }
  }

   createMarkup() {
  return {__html: this.state.html};
}

  componentDidMount(){
    // document.getElementById("xss").innerHTML = this.state.html;
  }
  render(){
    const backgroundImage = {
      backgroundImage: `url(https://cdn-images-1.medium.com/max/1024/0*ErN7MyOU7wjQLSgM.jpg)`
    };
    return(
      <div>
        <div className='blog-post'>
          <div className='blog-post-image' style={backgroundImage}>
            <div className='blog-post-post_details'>
              <div className='blog-post-title'
                dangerouslySetInnerHTML={this.createMarkup()}>
                </div>
              <div>
                <span className='blog-post-author'>Author: {this.state.author} | </span>
                <span className='blog-post-author'>Published On {new Date().toUTCString()}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
    )
  }
}

export default withRouter(FakeBlogPost)
