
/* import App from "./App.jsx";
console.log("hello, world");
const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<App />, wrapper) : false;*/


import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
// import App from './App.jsx';
import "@babel/polyfill";
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import utilitySprite from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import standardSprite from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg';
import { Route, Switch, HashRouter } from 'react-router-dom';
const NotFound = (props) => 
  <div>Page Not Found :( </div>
;

const App = lazy(() => import('./app/App.jsx'));
const Activity = lazy(() => import('./activity/Activity.jsx'));


ReactDOM.render(

  <IconSettings utilitySprite={utilitySprite} standardSprite={standardSprite}>
    <HashRouter basename="/">
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/App" component={App} />
          <Route exact path="/Activity/:mid" component={Activity} />
          <Route path='*' component={NotFound} />
        </Switch>
      </Suspense>
    </HashRouter>
  </IconSettings>
  ,
  document.getElementById('root')
);