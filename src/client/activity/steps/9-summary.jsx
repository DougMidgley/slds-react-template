import React, {Component} from 'react';
import Input from '@salesforce/design-system-react/components/input';
import PropTypes from 'prop-types';

/**
 * Step to review all details configured before confirming
 * @class
 * @memberof client/step
 */
class Summary extends Component {
    /**
     * returns constructor for Component
     * @param {object} props - React Component Props
     */
    constructor(props) {
        super(props);
    }

    /**
     * React Component to display
     * @return {jsx} returns react component
     */
    render() {
        console.log(this.props);

        let frequency;
        if (this.props.steps[2].config.recurring === 'weekly') {
            frequency =
                'Weekly, starting ' +
                ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][this.props.steps[2].config.recurringStart];
        } else if (this.props.steps[2].config.recurring === 'monthly') {
            frequency = 'Monthly, starting on day ' + this.props.steps[2].config.recurringStart;
        } else if (this.props.steps[2].config.recurring === 'once') {
            frequency = 'Once';
        }
        let start;
        let ends;
        if (this.props.steps[2].config.dateType === 'fixed') {
            start = new Date(this.props.steps[2].config.startDate).toString();
            ends = new Date(this.props.steps[2].config.endDate).toString();
        } else if (this.props.steps[2].config.dateType === 'dynamic') {
            start =
            this.props.steps[2].config.startOffset[0] +
                ' day(s) and ' +
                this.props.steps[2].config.startOffset[1] +
                ' hour(s) after entering Activity';
            ends = this.props.steps[2].config.endOffset[0] +
                ' day(s) and ' +
                this.props.steps[2].config.endOffset[1] +
                ' hour(s) after entering Activity';
        }
        return (
            <section className="slds-grid slds-p-around_medium slds-grid_vertical-align-center">
                <div className="slds-col">
                    <Input
                        id="summaryTemplate"
                        label="Task Template Id"
                        isStatic
                        value={this.props.steps[1].config.selection[0].Id}
                    />
                    <Input id="summaryTaskName" label="Task Name" isStatic value={this.props.steps[2].config.taskName} />

                    <Input
                        id="summaryFirstOnly"
                        label="Only for First Respondent Per Touchpoint"
                        isStatic
                        value={this.props.steps[0].config.onlyFirst==='first'? 'True':'False'}
                    />
                    <Input
                        id="summaryTaskType"
                        label="Selected Task type"
                        isStatic
                        value={this.props.steps[0].config.taskType}
                    />
                    <Input id="summaryRecurring" label="Frequency Task can be assigned" isStatic value={frequency} />
                    <Input id="summaryDates" label="Assigned Task will Start" isStatic value={start} />
                    <Input id="summaryDates" label="Assigned Task will End" isStatic value={ends} />
                </div>
            </section>
        );
    }

}

Summary.propTypes = {
    config: PropTypes.object,
    steps: PropTypes.array
};
export default Summary;