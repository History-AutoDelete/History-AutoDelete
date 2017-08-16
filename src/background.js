import {addExpression, incrementHistoryDeletedCounter, updateSetting} from "./redux/Actions";
import {getHostname, isAWebpage, spliceWWW} from "./libs";
import createStore from "./redux/Store";

let store;
let currentSettings;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const saveToStorage = () => browser.storage.local.set({state: JSON.stringify(store.getState())});

const getSetting = (settingName) => store.getState().settings[settingName].value;

// Keep History for X amount of days
const deleteOldHistory = () => browser.history.deleteRange({
	startTime: 0, endTime: Date.now() - (DAY * getSetting("daysToKeep"))
});

const createOldHistoryAlarm = () => browser.alarms.create("historyAutoDeleteAlarm", {periodInMinutes: 60});

const onSettingsChange = () => {
	let previousSettings = currentSettings;
	currentSettings = store.getState().settings;
	if (currentSettings.keepHistory.value && previousSettings.keepHistory.value !== currentSettings.keepHistory.value) {
		createOldHistoryAlarm();
		deleteOldHistory();
	} else if (!currentSettings.keepHistory.value && previousSettings.keepHistory.value !== currentSettings.keepHistory.value) {
		browser.alarms.clear("historyAutoDeleteAlarm");
	}
};

const migration = (oldSettings) => {
	if (Object.keys(oldSettings) !== 0 && oldSettings.migration_1 === undefined && oldSettings.keepHistorySetting !== undefined) {
		store.dispatch(
			updateSetting({payload: {
				name: "keepHistory", value: oldSettings.keepHistorySetting
			}})
		);
		store.dispatch(
			updateSetting({payload: {
				name: "daysToKeep", value: oldSettings.daysToKeep
			}})
		);
		store.dispatch(
			updateSetting({payload: {
				name: "statLogging", value: oldSettings.statLoggingSetting
			}})
		);
		store.dispatch(
			updateSetting({payload: {
				name: "showVisitsInIcon", value: oldSettings.showVisitsInIconSetting
			}})
		);
		oldSettings.URLS.forEach((domain) => store.dispatch(addExpression({payload: {expression: `${domain}*`}})));
		browser.storage.local.set({migration_1: true});
	}
};

// Show how many history entries for a domain
const showVisitsInBadge = async (tabURL, tabID) => {
	const results = await browser.history.search({
		text: getHostname(tabURL),
		maxResults: 1000000000,
		startTime: 0
	});
	browser.browserAction.setBadgeText({
		text: results.length.toString(), tabId: tabID
	});
	browser.browserAction.setBadgeBackgroundColor({
		color: "#e68d7d", tabId: tabID
	});
};

const findMatch = (expressionList, url) => expressionList.some((expression) => {
	// Have to make a new RegExp to avoid mutating the one in the store after test
	const regExpObj = new RegExp(expression.regExp);
	return regExpObj.test(url);
});

const onStartUp = async () => {
	const storage = await browser.storage.local.get();
	let stateFromStorage;
	try {
		if (storage.state !== undefined) {
			stateFromStorage = JSON.parse(storage.state);
		} else {
			stateFromStorage = {};
		}
	} catch (err) {
		stateFromStorage = {};
	}
	store = createStore(stateFromStorage);
	migration(storage);
	currentSettings = store.getState().settings;
	store.subscribe(onSettingsChange);
	store.subscribe(saveToStorage);
	if (getSetting("keepHistory")) {
		createOldHistoryAlarm();
		deleteOldHistory();
	}
};

onStartUp();

// Alarm event handler
browser.alarms.onAlarm.addListener((alarmInfo) => {
	if (alarmInfo.name === "historyAutoDeleteAlarm") {
		deleteOldHistory();
	}
});

// Logic that controls when to disable the browser action
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status === "complete") {
		const windowInfo = await browser.windows.getCurrent();
		if (!isAWebpage(tab.url) || windowInfo.incognito) {
			browser.browserAction.disable(tab.id);
			browser.browserAction.setBadgeText({
				text: "X", tabId: tab.id
			});
			browser.browserAction.setBadgeBackgroundColor({
				color: "red", tabId: tab.id
			});
		} else {
			browser.browserAction.enable(tab.id);
			browser.browserAction.setBadgeText({
				text: "", tabId: tab.id
			});

			if (getSetting("showVisitsInIcon")) {
				showVisitsInBadge(tab.url, tab.id);
			}
		}
	}
});

// Deletes the history on visit if in the expression list
browser.history.onVisited.addListener((historyItem) => {
	const currentHostUrl = spliceWWW(historyItem.url);
	if (findMatch(store.getState().expressions, currentHostUrl)) {
		if (getSetting("statLogging")) {
			store.dispatch(
				incrementHistoryDeletedCounter()
			);
		}
		return browser.history.deleteUrl({url: historyItem.url});
	}
	return null;
});
