import React, { Component } from "react";
import Input from '@salesforce/design-system-react/components/input'; 
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
    this.props.handleStepConfig(props.selectedStep , props.config);
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
            <h1 className="slds-text-title_caps slds-p-vertical_medium">Add some value</h1>
            <Input id="inputValue" label="Input Value" placeholder="My placeholder" onChange={this.handleChange} value={this.props.config.inputValue}/>
          </div>
        </div>
      </section>
    );
  }
}

export default TaskType;
