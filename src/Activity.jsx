import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from '@salesforce/design-system-react/components/button';


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
        <Button label="Changed Button" />
        <div>This is where the activity goes</div>
      </div>
        
    );
  }
}
export default App;