import React from 'react';
import { Route, Switch } from 'react-router-dom';

// All pages here
import InfoSec from './InfoSec'

const Router = () => (
    <main>
        <Switch>
           <Route path={'/'} component={InfoSec}/>
        </Switch>
    </main>
)

export default Router