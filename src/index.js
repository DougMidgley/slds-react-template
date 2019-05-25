
/*import App from "./App.jsx";
console.log("hello, world");
const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<App />, wrapper) : false;*/


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

ReactDOM.render(
      <App />,
    document.getElementById('root')
  );