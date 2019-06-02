import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from 'prop-types';
import StepManager from './stepManager.jsx';
import './styling.css';
import Step1 from './steps/1-selectType.jsx';
import Summary from './steps/9-summary.jsx';




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
      >
        <Step1/>
        <Summary/>
      </StepManager>
	  );
  }
}

Activity.displayName = 'ProgressIndicatorDefault';
export default Activity;