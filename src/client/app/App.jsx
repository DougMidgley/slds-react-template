import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from '@salesforce/design-system-react/components/button';


class App extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
    this.getapi = this.getapi.bind(this);
  }

  componentDidMount() {
    this.getapi();
  }
  getapi() {
    fetch('/api')
      .then(response => response.json())
      .then(data => this.setState((prevState) => {
        prevState.apidata = JSON.stringify(data);
        return prevState;
      }));
  }

  render() {
    
    return (
      <div>
        <Button label="Changed Button" />
        <div>this is from the app file</div>
        <div>{this.state.apidata}</div>
      </div>
        
    );
  }
}
export default App;