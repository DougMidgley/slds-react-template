import React, { Component } from 'react';
import ButtonGroup from '@salesforce/design-system-react/components/button-group';
import Checkbox from '@salesforce/design-system-react/components/checkbox';
import produce from 'immer';
import PropTypes from 'prop-types';
import StepTemplateType from './stepTemplateType';


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
    this.props.handleStepConfig( produce(this.props.selectedStep, (draftStep) => {
      draftStep.config.taskType = state.checked ? e.target.id : null;
      if(draftStep.config.taskType == null || draftStep.config.taskType == 'Task') draftStep.configured = false;
      else draftStep.configured = true;

      draftStep.config.onlyFirst = draftStep.config.taskType != 'Task' ? null : draftStep.config.onlyFirst;
      return draftStep;
    }));
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
                checked={this.props.selectedStep.config.taskType == 'Task'}
              />
              <Checkbox
                id="Quiz"
                label="Quiz"
                onChange={this.handleChange}
                checked={this.props.selectedStep.config.taskType == 'Quiz'}
              />
              <Checkbox
                id="Survey"
                label="Survey"
                onChange={this.handleChange}
                checked={this.props.selectedStep.config.taskType == 'Survey'}
              />
            </ButtonGroup>
          </div>
                    
          {this.props.selectedStep.config.taskType == 'Task' ? 
            <StepTemplateType handleStepConfig={this.props.handleStepConfig} selectedStep={this.props.selectedStep} /> : null }
        </div>
      </section>
    );
  }
}


TaskType.propTypes = {
  handleStepConfig: PropTypes.func,
  selectedStep: PropTypes.obj
};
export default TaskType;