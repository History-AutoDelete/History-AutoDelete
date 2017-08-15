/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const constants = {
  ADD_EXPRESSION: "ADD_EXPRESSION",
  REMOVE_EXPRESSION: "REMOVE_EXPRESSION",
  UPDATE_EXPRESSION: "UPDATE_EXPRESSION",
  INCREMENT_HISTORY_DELETED_COUNTER: "INCREMENT_HISTORY_DELETED_COUNTER",
  RESET_HISTORY_DELETED_COUNTER: "RESET_HISTORY_DELETED_COUNTER",
  UPDATE_SETTING: "UPDATE_SETTING",
  RESET_SETTINGS: "RESET_SETTINGS"
};

/* harmony default export */ __webpack_exports__["a"] = (constants);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Redux;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__redux_Store__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__libs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_Actions__ = __webpack_require__(8);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }





const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

let store;
let currentSettings;

const onStartUp = (() => {
	var _ref = _asyncToGenerator(function* () {
		const stateObject = yield browser.storage.local.get("state");
		store = Object(__WEBPACK_IMPORTED_MODULE_0__redux_Store__["a" /* default */])(JSON.parse(stateObject.state));
		currentSettings = store.getState().settings;
		store.subscribe(onSettingsChange);
		store.subscribe(saveToStorage);
		migration();
		if (getSetting("keepHistory")) {
			console.log("Created alarm");
			createOldHistoryAlarm();
			deleteOldHistory();
		}
	});

	return function onStartUp() {
		return _ref.apply(this, arguments);
	};
})();

onStartUp();

const saveToStorage = () => browser.storage.local.set({ state: JSON.stringify(store.getState()) });

const getSetting = settingName => store.getState().settings[settingName].value;

//Keep History for X amount of days
const deleteOldHistory = () => browser.history.deleteRange({ startTime: 0, endTime: Date.now() - DAY * getSetting("daysToKeep") });

//Alarm event handler
browser.alarms.onAlarm.addListener(alarmInfo => {
	if (alarmInfo.name === "historyAutoDeleteAlarm") {
		deleteOldHistory();
	}
});

const createOldHistoryAlarm = () => browser.alarms.create("historyAutoDeleteAlarm", { periodInMinutes: 60 });

const onSettingsChange = () => {
	let previousSettings = currentSettings;
	currentSettings = store.getState().settings;
	if (currentSettings["keepHistory"].value && previousSettings["keepHistory"].value !== currentSettings["keepHistory"].value) {
		createOldHistoryAlarm();
		deleteOldHistory();
		console.log("Created alarm");
	} else if (!currentSettings["keepHistory"].value && previousSettings["keepHistory"].value !== currentSettings["keepHistory"].value) {
		browser.alarms.clear("historyAutoDeleteAlarm");
		console.log("Deleted alarm");
	}
};

const migration = (() => {
	var _ref2 = _asyncToGenerator(function* () {
		const oldSettings = yield browser.storage.local.get();
		console.log(oldSettings);
		if (Object.keys(oldSettings) !== 0 && oldSettings.migration_1 === undefined && oldSettings.keepHistorySetting !== undefined) {
			store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["g" /* updateSetting */])({ payload: { name: "keepHistory", value: oldSettings.keepHistorySetting } }));
			store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["g" /* updateSetting */])({ payload: { name: "daysToKeep", value: oldSettings.daysToKeep } }));
			store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["g" /* updateSetting */])({ payload: { name: "statLogging", value: oldSettings.statLoggingSetting } }));
			store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["g" /* updateSetting */])({ payload: { name: "showVisitsInIcon", value: oldSettings.showVisitsInIconSetting } }));
			oldSettings.URLS.forEach(function (domain) {
				return store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["a" /* addExpression */])({ payload: { expression: `${domain}*` } }));
			});
			browser.storage.local.set({ migration_1: true });
		}
	});

	return function migration() {
		return _ref2.apply(this, arguments);
	};
})();

//Show how many history entries for a domain
const showVisitsInBadge = (() => {
	var _ref3 = _asyncToGenerator(function* (tabURL, tabID) {
		const results = yield browser.history.search({
			text: Object(__WEBPACK_IMPORTED_MODULE_1__libs__["a" /* getHostname */])(tabURL),
			maxResults: 1000000000,
			startTime: 0
		});
		browser.browserAction.setBadgeText({ text: results.length.toString(), tabId: tabID });
		browser.browserAction.setBadgeBackgroundColor({ color: "#e68d7d", tabId: tabID });
	});

	return function showVisitsInBadge(_x, _x2) {
		return _ref3.apply(this, arguments);
	};
})();

//Logic that controls when to disable the browser action
browser.tabs.onUpdated.addListener((() => {
	var _ref4 = _asyncToGenerator(function* (tabId, changeInfo, tab) {
		if (tab.status === "complete") {
			const windowInfo = yield browser.windows.getCurrent();
			if (!Object(__WEBPACK_IMPORTED_MODULE_1__libs__["b" /* isAWebpage */])(tab.url) || windowInfo.incognito) {
				browser.browserAction.disable(tab.id);
				browser.browserAction.setBadgeText({ text: "X", tabId: tab.id });
				browser.browserAction.setBadgeBackgroundColor({ color: "red", tabId: tab.id });
			} else {
				browser.browserAction.enable(tab.id);
				browser.browserAction.setBadgeText({ text: "", tabId: tab.id });

				if (getSetting("showVisitsInIcon")) {
					showVisitsInBadge(tab.url, tab.id);
				}
			}
		}
	});

	return function (_x3, _x4, _x5) {
		return _ref4.apply(this, arguments);
	};
})());

const findMatch = (url, expressionList) => {
	return expressionList.some(expression => {
		// Have to make a new RegExp to avoid mutating the one in the store after test
		const regExpObj = new RegExp(expression.regExp);
		return regExpObj.test(url);
	});
};

//Deletes the history on visit if in the set
browser.history.onVisited.addListener(historyItem => {
	const currentHostUrl = Object(__WEBPACK_IMPORTED_MODULE_1__libs__["c" /* spliceWWW */])(historyItem.url);
	if (findMatch(currentHostUrl, store.getState().expressions)) {
		store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_2__redux_Actions__["b" /* incrementHistoryDeletedCounter */])());
		return browser.history.deleteUrl({ url: historyItem.url });
	}
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_webext__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_webext___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_webext__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Reducers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_thunk__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Actions__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Constants__ = __webpack_require__(0);






const consoleMessages = store => next => action => {

  let result;

  // console.log(
  // `dispatching action => ${action.type}
  // payload => ${JSON.stringify(action.payload)}`);

  result = next(action);

  return result;
};

const actions = {
  UPDATE_SETTING: __WEBPACK_IMPORTED_MODULE_4__Actions__["g" /* updateSetting */],
  RESET_SETTINGS: __WEBPACK_IMPORTED_MODULE_4__Actions__["e" /* resetSettings */],
  ADD_EXPRESSION: __WEBPACK_IMPORTED_MODULE_4__Actions__["a" /* addExpression */],
  REMOVE_EXPRESSION: __WEBPACK_IMPORTED_MODULE_4__Actions__["c" /* removeExpression */],
  UPDATE_EXPRESSION: __WEBPACK_IMPORTED_MODULE_4__Actions__["f" /* updateExpression */],
  RESET_HISTORY_DELETED_COUNTER: __WEBPACK_IMPORTED_MODULE_4__Actions__["d" /* resetHistoryDeletedCounter */]
};

/* harmony default export */ __webpack_exports__["a"] = (state => Object(__WEBPACK_IMPORTED_MODULE_1_redux_webext__["createBackgroundStore"])({
  store: Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_2__Reducers__["a" /* default */], state, Object(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_3_redux_thunk___default.a, consoleMessages)),
  actions
}));

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReduxWebExt;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_shortid__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_shortid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_shortid__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };





const globStringToRegex = str => `^${preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.')}$`;
// http://kevin.vanzonneveld.net
// +   original by: booeyOH
// +   improved by: Ates Goral (http://magnetiq.com)
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   bugfixed by: Onno Marsman
// +   improved by: Brett Zamir (http://brett-zamir.me)
// *     example 1: preg_quote("$40");
// *     returns 1: '\$40'
// *     example 2: preg_quote("*RRRING* Hello?");
// *     returns 2: '\*RRRING\* Hello\?'
// *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
// *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
const preg_quote = (str, delimiter) => (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');

const hasExpression = (state, action) => state.some(expression => expression.expression === action.payload.expression);

const expression = (state = {}, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].UPDATE_EXPRESSION:
      if (state.id === action.payload.id) {
        const newExpressionObject = _extends({}, action.payload, {
          id: __WEBPACK_IMPORTED_MODULE_2_shortid___default.a.generate(),
          regExp: globStringToRegex(action.payload.expression)
        });
        return newExpressionObject;
      }

      return state;

    default:
      return state;
  }
};
/* unused harmony export expression */


const expressions = (state = [], action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].ADD_EXPRESSION:
      if (hasExpression(state, action)) {
        return state;
      }
      const newExpressionObject = _extends({}, action.payload, {
        id: __WEBPACK_IMPORTED_MODULE_2_shortid___default.a.generate(),
        regExp: globStringToRegex(action.payload.expression)
      });
      return [...state, newExpressionObject].sort((a, b) => a.expression.localeCompare(b.expression));

    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].UPDATE_EXPRESSION:
      if (hasExpression(state, action)) {
        return state;
      }
      return state.map(e => expression(e, action)).sort((a, b) => a.expression.localeCompare(b.expression));

    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].REMOVE_EXPRESSION:
      return state.filter(expression => expression.id !== action.payload.id);

    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_SETTINGS:
      return [];

    default:
      return state;
  }
};
/* unused harmony export expressions */


const initialSettings = {
  keepHistory: {
    name: "keepHistory",
    value: false,
    id: 1
  },
  daysToKeep: {
    name: "daysToKeep",
    value: 60,
    id: 2
  },
  statLogging: {
    name: "statLogging",
    value: true,
    id: 3
  },
  showVisitsInIcon: {
    name: "showVisitsInIcon",
    value: false,
    id: 4
  }
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].UPDATE_SETTING:
      const { name } = action.payload;
      let newObject = _extends({}, state);
      newObject[name] = action.payload;
      return newObject;
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_SETTINGS:
      return initialSettings;
    default:
      return state;
  }
};
/* unused harmony export settings */


const historyDeletedCounterTotal = (state = 0, action) => {
  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].INCREMENT_HISTORY_DELETED_COUNTER:
      return state + 1;

    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_SETTINGS:
    case __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_HISTORY_DELETED_COUNTER:
      return 0;
    default:
      return state;
  }
};
/* unused harmony export historyDeletedCounterTotal */


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_redux__["combineReducers"])({
  expressions,
  historyDeletedCounterTotal,
  settings
}));

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = ShortId;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = ReduxThunk;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(0);


const addExpression = expression => {
  const { payload } = expression;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].ADD_EXPRESSION,
    payload
  };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addExpression;


const removeExpression = expression => {
  const { payload } = expression;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].REMOVE_EXPRESSION,
    payload
  };
};
/* harmony export (immutable) */ __webpack_exports__["c"] = removeExpression;


const updateExpression = expression => {
  const { payload } = expression;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].UPDATE_EXPRESSION,
    payload
  };
};
/* harmony export (immutable) */ __webpack_exports__["f"] = updateExpression;


const incrementHistoryDeletedCounter = () => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].INCREMENT_HISTORY_DELETED_COUNTER
  };
};
/* harmony export (immutable) */ __webpack_exports__["b"] = incrementHistoryDeletedCounter;


const resetHistoryDeletedCounter = () => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_HISTORY_DELETED_COUNTER
  };
};
/* harmony export (immutable) */ __webpack_exports__["d"] = resetHistoryDeletedCounter;


const updateSetting = payloadSetting => {
  const { payload } = payloadSetting;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].UPDATE_SETTING,
    payload
  };
};
/* harmony export (immutable) */ __webpack_exports__["g"] = updateSetting;


const resetSettings = () => {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* default */].RESET_SETTINGS
  };
};
/* harmony export (immutable) */ __webpack_exports__["e"] = resetSettings;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// Returns the host name of the url. Etc. "https://en.wikipedia.org/wiki/Cat" becomes en.wikipedia.org
const getHostname = urlToGetHostName => {
	let hostname;
	try {
		hostname = new URL(urlToGetHostName).hostname;
		// Strip "www." if the URL starts with it.
		hostname = hostname.replace(/^www[a-z0-9]?\./, "");
	} catch (error) {
		return "";
	}
	return hostname;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getHostname;


// Returns true if it is a webpage
const isAWebpage = URL => {
	if (URL.match(/^http:/) || URL.match(/^https:/)) {
		return true;
	}
	return false;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = isAWebpage;


const spliceWWW = url => {
	let newURL;
	try {
		let urlObject = new URL(url);
		newURL = `${urlObject.hostname}${urlObject.pathname}`;
		// Strip "www." if the URL starts with it.
		newURL = newURL.replace(/^www[a-z0-9]?\./, "");
	} catch (error) {
		return "";
	}
	return newURL;
};
/* harmony export (immutable) */ __webpack_exports__["c"] = spliceWWW;


/***/ })
/******/ ]);