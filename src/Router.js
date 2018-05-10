import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header'
import Footer from "./components/Footer";

// All pages here
import InfoSec from './InfoSec'
import Privacy from './Privacy'
import BlogPost from "./components/BlogPost";



const Router = () => (
    <main>
      <Header/>
        <Switch>
            <Route path={'/blogpost'} component={BlogPost}/>
            <Route path={'/privacy'} component={Privacy}/>
            <Route exact path={'/'} component={InfoSec}/>
        </Switch>
        <Footer/>
    </main>
)

export default Router
