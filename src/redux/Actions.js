import C from "./Constants";
import initialState from "./initialState.json";

export const addExpression = (expression) => {
	const {payload} = expression;
	return {
		type: C.ADD_EXPRESSION,
		payload
	};
};

export const removeExpression = (expression) => {
	const {payload} = expression;
	return {
		type: C.REMOVE_EXPRESSION,
		payload
	};
};

export const updateExpression = (expression) => {
	const {payload} = expression;
	return {
		type: C.UPDATE_EXPRESSION,
		payload
	};
};

export const incrementHistoryDeletedCounter = () => ({type: C.INCREMENT_HISTORY_DELETED_COUNTER});

export const resetHistoryDeletedCounter = () => ({type: C.RESET_HISTORY_DELETED_COUNTER});

export const updateSetting = (payloadSetting) => {
	const {payload} = payloadSetting;
	return {
		type: C.UPDATE_SETTING,
		payload
	};
};

export const resetSettings = () => ({type: C.RESET_SETTINGS});

export const validateSettings = () => (dispatch, getState) => {
	const {settings} = getState();
	const initialSettings = initialState.settings;
	const settingKeys = Object.keys(settings);
	const initialSettingKeys = Object.keys(initialSettings);

	const invividalSettingKeysMatch = Object.keys(settings[settingKeys[0]]).length === Object.keys(initialSettings[initialSettingKeys[0]]).length;

	// Missing a property in a individual setting
	if (!invividalSettingKeysMatch) {
		settingKeys.forEach((element) => {
			dispatch({
				type: C.UPDATE_SETTING,
				payload: settings[element]
			});
		});
	}

	// Missing a setting
	if (settingKeys.length !== initialSettingKeys.length) {
		initialSettingKeys.forEach((element) => {
			if (settings[element] === undefined) {
				dispatch({
					type: C.UPDATE_SETTING,
					payload: initialSettings[element]
				});
			}
		});
	}
};
