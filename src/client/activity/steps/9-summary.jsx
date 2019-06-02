import React, { Component } from 'react';
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
    static label = "Confirm Message";
    static assistiveText = "Message from Content Builder SMS";
    static configured = true;

    /**
     * React Component to display
     * @return {jsx} returns react component
     */
    render() {
      return (
        <section className="slds-grid slds-p-around_medium slds-grid_vertical-align-center">
          <div className="slds-col">
            <Input
              id="summaryTemplate"
              label="values in config"
              isStatic
              value={JSON.stringify(this.props.config)}
            />
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