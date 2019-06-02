import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import ProgressIndicator from "@salesforce/design-system-react/components/progress-indicator";
import Alert from "@salesforce/design-system-react/components/alert";
import AlertContainer from "@salesforce/design-system-react/components/alert/container";
import Spinner from "@salesforce/design-system-react/components/spinner";
import Postmonger from "postmonger";
const connection = new Postmonger.Session();

function extractStepDetails(steps) {
  const arr = [];
  steps.forEach((e,i) => {
    arr.push({ id: i +1 , label: e.type.label, assistiveText: e.type.assistiveText });
  });
  return arr;
}

/*
 * This example allows you to select the next
 *step and only the next
 * step.Typically, Progress Indicator should be paired with a modal and form errors
 * should be explained outside of this component.
 */
class StepManager extends React.Component {
  constructor(props) {
    super(props);
    console.log("children", props.children);
    const steps = extractStepDetails(props.children);
    this.state = {
      steps: steps,
      completedSteps: [],
      disabledSteps: steps.slice(2, steps.length),
      selectedStep: steps[0],
      config: {}
    };
    this.showStep = this.showStep.bind(this);
    this.handleStepEvent = this.handleStepEvent.bind(this);
    this.handleStepConfig = this.handleStepConfig.bind(this);
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
        text: this.state.selectedStep.id == this.state.steps.length ? "done" : "next",
        enabled: this.state.selectedStep.configured == true ? true : false,
        visible: true
      });
    }
  }

  /**
     * validates the config from the step
     * @param {object} step - step which needs components updating
     */
  handleStepConfig(step, config) {
    console.log("handleStepConfig", step);
    this.setState(prevState => {
      prevState.selectedStep = step;
      prevState.steps[step.id - 1] = step;
      prevState.config = Object.assign(prevState.config, config);
      console.log("prevState.steps[step.id]: " + prevState);
      return prevState;
    });
  }

    handleStepEvent = (event, data) => {
      this.setState({
        completedSteps: this.state.steps.slice(0, data.step.id),
        disabledSteps: data.step.id < this.state.steps.length ? this.state.steps.slice(data.step.id + 2, this.state.steps.length) : [],
        selectedStep: data.step
      });
    };

    /**
     * manages which step should be displayed in the Activity window
     * then triggers to button changes
     * @param {object} data - step which should be displayed
     * @param {string} action - was this step going back or forth
     */
    handleStepChange(data) {
      this.setState(
        prevState => {
          if (data == "next" && prevState.selectedStep.id == prevState.steps.length) {
            prevState.payload.metaData.isConfigured = true;
            console.log("state before parsing", prevState);
            prevState.payload = this.parseArguments(prevState.payload, prevState.interaction.id);
            connection.trigger("updateActivity", prevState.payload);
          } else if (data == "next") {
            prevState.selectedStep = prevState.steps[this.state.selectedStep.id];
            return prevState;
          } else if (data == "prev") {
            prevState.selectedStep = prevState.steps[this.state.selectedStep.id - 2];
            return prevState;
          }
        },
        () => connection.trigger("ready")
      );
    }
    /**
     * manages which step should be displayed in the Activity window
     * @param {object} step - step which should be displayed
     * @return {jsx} returns react component
     */
    showStep(step) {
      console.log("show step step", step);
      console.log("show step state", this.state);
      console.log("show step props", this.props);
      const stepImm = step;
      if (!step) {
        return <Spinner assistiveText="Loading ..." id="loading-status-icon" size="large" variant="brand" />;
      } else if (stepImm && this.state.interaction && this.state.interaction.id == null) {
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
      } else if (stepImm && this.props.children.length == this.state.steps.length) {
        // add step config change handler
        return React.cloneElement(this.props.children[stepImm.id - 1], {
          selectedStep: this.state.selectedStep,
          handleStepConfig: this.handleStepConfig,
          config: this.state.config
        });
      } else {
        throw new Error("unknown action");
      }
    }

    render() {
      console.log("stepManager", this.state, this.props);
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
              steps={this.state.steps}
              selectedStep={this.state.selectedStep}
              // tooltipIsOpenSteps={stepsBasic.slice(0, 2)}
            />
          </div>
        </div>
      );
    }
}
export default StepManager;
