import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from '../node_modules/@salesforce/design-system-react/components/button';


class App extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }
  static staticMethod() {
    return 'static method has been called.';
  }
  render() {
    return (
        <div>
            <Button label="Hello Button" />
            <div>this is from the app file</div>
        </div>
        
    );
  }
}
export default App;