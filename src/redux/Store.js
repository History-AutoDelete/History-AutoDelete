import {createStore, applyMiddleware} from 'redux';
import {createBackgroundStore} from 'redux-webext';
import reducer from './Reducers';
import thunk from 'redux-thunk';
import {
  updateSetting,
  resetSettings,
  addExpression,
  removeExpression,
  updateExpression,
  resetHistoryDeletedCounter
} from './Actions';
import C from './Constants';
const consoleMessages = store => next => action => {

	let result;

	// console.log(
  // `dispatching action => ${action.type}
  // payload => ${JSON.stringify(action.payload)}`);

	result = next(action);

	return result;

}

const actions = {
  UPDATE_SETTING: updateSetting,
  RESET_SETTINGS: resetSettings,
  ADD_EXPRESSION: addExpression,
  REMOVE_EXPRESSION: removeExpression,
  UPDATE_EXPRESSION: updateExpression,
  RESET_HISTORY_DELETED_COUNTER: resetHistoryDeletedCounter
};

export default (state) => createBackgroundStore({
     store: createStore(reducer, state, applyMiddleware(thunk, consoleMessages)),
     actions
 });
