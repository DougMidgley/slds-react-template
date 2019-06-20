import React from "react";
// import PropTypes from 'prop-types';
import StepManager from "./stepManager.jsx";
import "./styling.css";
import Step1 from "./steps/1-selectType.jsx";
import Step2 from "./steps/2-randomText.jsx";
import Summary from "./steps/9-summary.jsx";

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
      <StepManager errorMsg="Unfortunately there was an error">
        <Step1 label="Pick Message" assistiveText="Message from Content Builder SMS" />
        <Step2 label="Provide Text Value" assistiveText="Something insightful" />
        <Summary label="Confirm Message" assistiveText="Message from Content Builder SMS" configured={true} />
      </StepManager>
    );
  }
}
Activity.displayName = "ProgressIndicatorDefault";
export default Activity;
