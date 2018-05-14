import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header'
import Footer from "./components/Footer";

// All pages here
import InfoSec from './InfoSec'
import Privacy from './Privacy'
import BlogPost from "./components/BlogPost"
import Encryption from './Encryption'
import DemoSQL from './DemoSQL'
import DemoXSS from './DemoXSS'
import FakeBlogPost from './FakeBlogPost'



const Router = () => (
    <main>
      <Header/>
        <Switch>
            <Route path={'/fakeblogpost/:title'} component={FakeBlogPost}/>
            <Route exact path={'/blogpost/1526-268861-1917'} component={DemoXSS}/>
            <Route exact path={'/blogpost/1526-173239-8806'} component={Encryption}/>
            <Route exact path={'/blogpost/1526-172282-7746'} component={DemoSQL}/>
            <Route path={'/blogpost'} component={BlogPost}/>
            <Route path={'/privacy'} component={Privacy}/>
            <Route exact path={'/'} component={InfoSec}/>
        </Switch>
        <Footer/>
    </main>
)

export default Router
