import C from './Constants';

export const addExpression = (expression) => {
  const { payload } = expression;
  return {
    type: C.ADD_EXPRESSION,
    payload
  };
};

export const removeExpression = (expression) => {
  const { payload } = expression;
  return {
    type: C.REMOVE_EXPRESSION,
    payload
  };
};

export const updateExpression = (expression) => {
  const { payload } = expression;
  return {
    type: C.UPDATE_EXPRESSION,
    payload
  };
};

export const incrementHistoryDeletedCounter = () => {
  return {
    type: C.INCREMENT_HISTORY_DELETED_COUNTER
  };
};

export const resetHistoryDeletedCounter = () => {
  return {
    type: C.RESET_HISTORY_DELETED_COUNTER
  };
};

export const updateSetting = (payloadSetting) => {
  const { payload } = payloadSetting;
  return {
    type: C.UPDATE_SETTING,
    payload
  };
};

export const resetSettings = () => {
  return {
    type: C.RESET_SETTINGS
  };
};
