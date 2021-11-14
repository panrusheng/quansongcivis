import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Mobile from 'pages/Mobile/Mobile';

const getRouter = () => (

    <Router>
      <Switch >
        <Route exact path="/" component={Mobile}/>
      </Switch>
    </Router>

)
export default getRouter