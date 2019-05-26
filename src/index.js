
/*import App from "./App.jsx";
console.log("hello, world");
const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<App />, wrapper) : false;*/


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import "@babel/polyfill";
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import utilitySprite from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import standardSprite from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg';

ReactDOM.render(

  <IconSettings utilitySprite={utilitySprite} standardSprite={standardSprite}>
<App />
</IconSettings>
      ,
    document.getElementById('root')
  );