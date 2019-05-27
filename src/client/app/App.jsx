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
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    this.getapi();
    this.getUserInfo();
  }

  async getUserInfo(){ {
    try {
      const url = "https://mc7t1g5l24q50klr8c1gqkvj63d1.auth.marketingcloudapis.com/v2/userinfo";
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };
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