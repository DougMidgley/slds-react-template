import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from 'prop-types';
import ProgressIndicator from '@salesforce/design-system-react/components/progress-indicator'; 
import Button from '@salesforce/design-system-react/components/button';
import steps from './steps.json';
import { init, manageStep } from './journeyBuilder.js';




/*
 * This example allows you to select the next 
 *step and only the next 
 * step.Typically, Progress Indicator should be paired with a modal and form errors 
 * should be explained outside of this component.
 */
class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mid : this.props.match.params.mid,
      steps,
      completedSteps: [],
      disabledSteps: steps.slice(2, steps.length),
      selectedStep: steps[0],
    };
    // this.getapi = this.getapi;
    // this.init = init.bind(this);
    this.setState = this.setState.bind(this);
  }

  /**
     * run all postmonger triggers and manage response
     */
  componentDidMount() {
    init(this.setState);
  }
  /**
     * Standard React Function to manage updates to manage changes made to state
     */
  componentDidUpdate() {
    manageStep(this.setState, this.state);
  }

	handleStepEvent = (event, data) => {
	  this.setState({
	    completedSteps: steps.slice(0, data.step.id),
	    disabledSteps:
				data.step.id < steps.length
				  ? steps.slice(data.step.id + 2, steps.length)
				  : [],
	    selectedStep: data.step,
	  });
	};

	render() {
	  return (
	      <div
	        style={{
	          padding: '4rem 1rem 0px',
	          background:
							this.props.variant === 'modal' ? 'rgb(244, 246, 249)' : undefined,
	        }}
	      >
	        <ProgressIndicator
	          id="example-progress-indicator"
	          completedSteps={this.state.completedSteps}
	          disabledSteps={this.state.disabledSteps}
	          onStepClick={this.handleStepEvent}
	          steps={this.state.steps}
	          selectedStep={this.state.selectedStep}
	          // tooltipIsOpenSteps={stepsBasic.slice(0, 2)}
	        />
	      </div>
	  );
	}
}

Activity.displayName = 'ProgressIndicatorDefault';
export default Activity;