
import Postmonger from 'postmonger';
const connection = new Postmonger.Session();

export default {
  init: function(callback){
    callback((prevState, props) => {
      prevState.journey = {};
      return prevState;
    });
    connection.on('requestedTokens', (data) => callback((prevState, props) => {
      prevState.journey.tokens = data;
      return prevState;
    }));
    connection.on('requestedCulture', (data) => this.setState({ culture: data }));
    connection.on('initActivity', (data) => this.setState({ payload: data }));
    connection.on('requestedSchema', (data) => this.setState({ schema: data }));
    connection.on('requestedInteraction', (data) => this.setState({ interaction: data }));
    connection.on('clickedNext', (data) => this.handleStepChange('next'));
    connection.on('clickedBack', (data) => this.handleStepChange('prev'));
    connection.on('requestedTriggerEventDefinition', (data) => this.setState({ eventDefinition: data }));
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestCulture');
    connection.trigger('requestTriggerEventDefinition');
    connection.trigger('requestSchema');
    connection.trigger('requestInteraction');
  },
  ready: function(data){
    data.tokens &&
        data.culture &&
        data.payload &&
        data.interaction &&
        data.selectedStep == null;
    
  }
};
