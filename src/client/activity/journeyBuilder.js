
import Postmonger from 'postmonger';
const connection = new Postmonger.Session();
import steps from './steps.json';
export function init(callback) {
  {
    console.log('initialisation');
    callback((prevState, props) => {
      prevState.journey = {};
      return prevState;
    });
    connection.on('requestedTokens', (data) => callback((prevState, props) => {
      prevState.journey.tokens = data;
      return prevState;
    }));
    connection.on('requestedCulture', (data) => callback({ culture: data }));
    connection.on('initActivity', (data) => callback({ payload: data }));
    connection.on('requestedSchema', (data) => callback({ schema: data }));
    connection.on('requestedInteraction', (data) => callback({ interaction: data }));
    connection.on('clickedNext', (data) => this.handleStepChange('next'));
    connection.on('clickedBack', (data) => this.handleStepChange('prev'));
    connection.on('requestedTriggerEventDefinition', (data) => callback({ eventDefinition: data }));
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestCulture');
    connection.trigger('requestTriggerEventDefinition');
    connection.trigger('requestSchema');
    connection.trigger('requestInteraction');
  }
}
export function ready(data) {
  if( data.tokens &&
    data.culture &&
    data.payload &&
    data.interaction &&
    data.selectedStep == null) {
    console.log('Ready to go');
    
  } else {
    console.log('Still not ready');
  }
}

export function manageStep(callback, state){
  // console.log('componentDidUpdate', prevState, state);
  if (state.journey.tokens &&
    state.journey.culture &&
    state.journey.payload &&
    state.journey.interaction &&
    state.journey.selectedStep == null) {
    callback(
      (prevState) => {
        console.log('Initial Config', state);
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
      () => connection.trigger('ready')
    );
  } else if (state.selectedStep != null) {
    console.log('else if');
    connection.trigger('updateButton', {
      button: 'back',
      enabled: state.selectedStep.id > 1,
      visible: state.selectedStep.id > 1
    });
    connection.trigger('updateButton', {
      button: 'next',
      text: state.selectedStep.id == state.steps.length ? 'done' : 'next',
      enabled: state.selectedStep.configured == true ? true : false,
      visible: true
    });
  }
}
