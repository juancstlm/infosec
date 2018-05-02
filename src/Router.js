import React from 'react';
import { Route, Switch } from 'react-router-dom';

// All pages here
import InfoSec from './InfoSec'
import Privacy from './Privacy'


const Router = () => (
    <main>
        <Switch>
            <Route path={'/privacy'} component={Privacy}/>
            <Route path={'/'} component={InfoSec}/>
        </Switch>
    </main>
)

export default Router