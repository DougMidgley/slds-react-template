import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import ProgressIndicator from "@salesforce/design-system-react/components/progress-indicator";
import Button from "@salesforce/design-system-react/components/button";
import Alert from "@salesforce/design-system-react/components/alert";
import AlertContainer from "@salesforce/design-system-react/components/alert/container";
import Spinner from "@salesforce/design-system-react/components/spinner";
import steps from "./steps.json";
import Postmonger from "postmonger";
const connection = new Postmonger.Session();

/*
 * This example allows you to select the next
 *step and only the next
 * step.Typically, Progress Indicator should be paired with a modal and form errors
 * should be explained outside of this component.
 */
class StepManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: props.steps,
      completedSteps: [],
      disabledSteps: props.steps.slice(2, props.steps.length),
      selectedStep: props.steps[0]
    };
    // this.getapi = this.getapi;
    // this.init = init.bind(this);
    // this.setState = this.setState.bind(this);
    this.showStep = this.showStep.bind(this);
    this.handleStepEvent = this.handleStepEvent.bind(this);
  }

  /**
     * run all postmonger triggers and manage response
     */
  componentDidMount() {
    this.setState((prevState, props) => {
      prevState.journey = {};
      return prevState;
    });
    connection.on("requestedTokens", data =>
      this.setState((prevState, props) => {
        prevState.journey.tokens = data;
        return prevState;
      })
    );
    connection.on("requestedCulture", data => this.setState({ culture: data }));
    connection.on("initActivity", data => this.setState({ payload: data }));
    connection.on("requestedSchema", data => this.setState({ schema: data }));
    connection.on("requestedInteraction", data => this.setState({ interaction: data }));
    connection.on("clickedNext", data => this.handleStepChange("next"));
    connection.on("clickedBack", data => this.handleStepChange("prev"));
    connection.on("requestedTriggerEventDefinition", data => this.setState({ eventDefinition: data }));
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestCulture");
    connection.trigger("requestTriggerEventDefinition");
    connection.trigger("requestSchema");
    connection.trigger("requestInteraction");
  }
  /**
     * Standard React Function to manage updates to manage changes made to state
     */
  componentDidUpdate() {
    // console.log('componentDidUpdate', prevState, state);
    if (
      this.state.journey.tokens &&
            this.state.journey.culture &&
            this.state.journey.payload &&
            this.state.journey.interaction &&
            this.state.journey.selectedStep == null
    ) {
      this.setState(
        prevState => {
          console.log("Initial Config", state);
          prevState.steps = steps;
          if (
            prevState.payload.arguments.execute.inArguments.length > 0 &&
                        prevState.payload.arguments.execute.inArguments[0].Steps &&
                        prevState.payload.arguments.execute.inArguments[0].Steps.length > 0
          ) {
            prevState.payload.arguments.execute.inArguments[0].Steps.forEach((el, i) => {
              prevState.steps[i].config = el.config;
              prevState.steps[i].configured = el.configured;
            });
          }
          prevState.selectedStep = prevState.steps[0];
          return prevState;
        },
        () => connection.trigger("ready")
      );
    } else if (this.state.selectedStep != null) {
      console.log("else if");
      connection.trigger("updateButton", {
        button: "back",
        enabled: this.state.selectedStep.id > 1,
        visible: this.state.selectedStep.id > 1
      });
      connection.trigger("updateButton", {
        button: "next",
        text: this.state.selectedStep.id == this.props.steps.length ? "done" : "next",
        enabled: this.state.selectedStep.configured == true ? true : false,
        visible: true
      });
    }
  }

    handleStepEvent = (event, data) => {
      this.setState({
        completedSteps: steps.slice(0, data.step.id),
        disabledSteps: data.step.id < steps.length ? steps.slice(data.step.id + 2, steps.length) : [],
        selectedStep: data.step
      });
    };
    /**
     * manages which step should be displayed in the Activity window
     * @param {object} step - step which should be displayed
     * @return {jsx} returns react component
     */
    showStep(step) {
      if (!step) {
        return <Spinner assistiveText="Loading ..." id="loading-status-icon" size="large" variant="brand" />;
      } else if (this.state.interaction && this.state.interaction.id == null) {
        return (
          <AlertContainer>
            <Alert
              labels={{
                heading: "You must save the Journey first before configuring activity"
              }}
              variant="warning"
            />
          </AlertContainer>
        );
      } else if (this.props.children.length == this.props.steps.length) {
        return this.props.children[step.id - 1];
      } else {
        throw new Error("unknown action");
      }
    }

    render() {
      return (
        <div
          style={{
            padding: "4rem 1rem 0px",
            background: this.props.variant === "modal" ? "rgb(244, 246, 249)" : undefined
          }}
        >
          <div className="Activity">{this.showStep(this.state.selectedStep)}</div>
          <div className="ProgressContainer">
            <ProgressIndicator
              id="example-progress-indicator"
              completedSteps={this.state.completedSteps}
              disabledSteps={this.state.disabledSteps}
              onStepClick={this.handleStepEvent}
              steps={this.props.steps}
              selectedStep={this.state.selectedStep}
              // tooltipIsOpenSteps={stepsBasic.slice(0, 2)}
            />
          </div>
        </div>
      );
    }
}
export default StepManager;