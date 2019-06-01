import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from 'prop-types';
import steps from './steps.json';
import StepManager from './stepManager.jsx';
import './styling.css';




/*
 * This example allows you to select the next 
 *step and only the next 
 * step.Typically, Progress Indicator should be paired with a modal and form errors 
 * should be explained outside of this component.
 */
class Activity extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
	  return (
      <StepManager
        errorMsg = "Unfortunately there was an error"
        steps={steps}
      >
        <div>step1</div>
        <div>step2</div>
      </StepManager>
	  );
  }
}

Activity.displayName = 'ProgressIndicatorDefault';
export default Activity;