import React, { Component } from "react";
import ButtonGroup from "@salesforce/design-system-react/components/button-group";
import Checkbox from "@salesforce/design-system-react/components/checkbox";
import produce from "immer";
import PropTypes from "prop-types";

/**
 * Step to select Type of Tasks (Quiz, Survey or Task)
 * @class
 * @memberof client/step
 */
class TaskType extends Component {
  /**
     * returns constructor for Component
     * @param {object} props - React Component Props
     */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
    static label = "Select Message";
    static assistiveText = "Message from Content Builder SMS";

    /**
     * Handles change from both time and date
     * @param {event} e - event which was fired from clicking type option
     * @param {object} state - current state of component
     */
    handleChange(e, state) {
      const props = produce(this.props, draftProps => {
        draftProps.config.taskType = state.checked ? e.target.id : null;
        if (draftProps.config.taskType == null || draftProps.config.taskType == "Task") {
          draftProps.selectedStep.configured = false;
        } else {
          draftProps.selectedStep.configured = true;
        }
        draftProps.config.onlyFirst = draftProps.config.taskType != "Task" ? null : draftProps.config.onlyFirst;
        return draftProps;
      });
      this.props.handleStepConfig(props.selectedStep, props.config);
    }
    /**
     * React Component to display
     * @return {jsx} returns react component
     */
    render() {
      return (
        <section className="slds-grid slds-p-around_medium slds-grid_vertical-align-center">
          <div className="slds-col slds-text-align_center">
            <div id="taskType">
              <h1 className="slds-text-title_caps slds-p-vertical_medium">Select Type of Task</h1>
              <ButtonGroup variant="checkbox">
                <Checkbox
                  id="Task"
                  label="Task"
                  onChange={this.handleChange}
                  checked={this.props.config.taskType == "Task"}
                />
                <Checkbox
                  id="Quiz"
                  label="Quiz"
                  onChange={this.handleChange}
                  checked={this.props.config.taskType == "Quiz"}
                />
                <Checkbox
                  id="Survey"
                  label="Survey"
                  onChange={this.handleChange}
                  checked={this.props.config.taskType == "Survey"}
                />
              </ButtonGroup>
            </div>
          </div>
        </section>
      );
    }
}

export default TaskType;
