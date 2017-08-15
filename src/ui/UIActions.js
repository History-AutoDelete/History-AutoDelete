import C from "../redux/Constants";

export const updateSettingUI = (payload) => ({
	type: C.UPDATE_SETTING,
	payload
});

export const resetSettingsUI = () => ({type: C.RESET_SETTINGS});
export const resetHistoryDeletedCounterUI = () => ({type: C.RESET_HISTORY_DELETED_COUNTER});

export const addExpressionUI = (payload) => ({
	type: C.ADD_EXPRESSION,
	payload
});

export const removeExpressionUI = (payload) => ({
	type: C.REMOVE_EXPRESSION,
	payload
});

export const updateExpressionUI = (payload) => ({
	type: C.UPDATE_EXPRESSION,
	payload
});
