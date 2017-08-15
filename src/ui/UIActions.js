import C from '../redux/Constants';

export const updateSettingUI = (payload) => {
  return {
    type: C.UPDATE_SETTING,
    payload
  };
};

export const resetSettingsUI = () => {
  return {
    type: C.RESET_SETTINGS
  };
};
export const resetHistoryDeletedCounterUI = () => {
  return {
    type: C.RESET_HISTORY_DELETED_COUNTER
  };
};

export const addExpressionUI = (payload) => {
  return {
    type: C.ADD_EXPRESSION,
    payload
  };
};

export const removeExpressionUI = (payload) => {
  return {
    type: C.REMOVE_EXPRESSION,
    payload
  };
};

export const updateExpressionUI = (payload) => {
  return {
    type: C.UPDATE_EXPRESSION,
    payload
  };
};
