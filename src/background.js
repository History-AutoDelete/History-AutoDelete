import createStore from './redux/Store';
import { getHostname, isAWebpage, spliceWWW } from './libs';
import { incrementHistoryDeletedCounter, updateSetting, addExpression } from './redux/Actions'

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

let store;
let currentSettings;

const onStartUp = async() => {
	const stateObject = await browser.storage.local.get("state");
	store = createStore(JSON.parse(stateObject.state));
	currentSettings = store.getState().settings;
	store.subscribe(onSettingsChange);
	store.subscribe(saveToStorage);
	migration();
  if(getSetting("keepHistory")) {
    console.log("Created alarm");
    createOldHistoryAlarm();
    deleteOldHistory();
  }
}

onStartUp();

const saveToStorage = () => browser.storage.local.set({state: JSON.stringify(store.getState())});

const getSetting = (settingName) => store.getState().settings[settingName].value;

//Keep History for X amount of days
const deleteOldHistory = () => browser.history.deleteRange({startTime: 0, endTime: Date.now() - (DAY*getSetting("daysToKeep"))});


//Alarm event handler
browser.alarms.onAlarm.addListener((alarmInfo) => {
	if(alarmInfo.name === "historyAutoDeleteAlarm") {
		deleteOldHistory();
	}
});

const createOldHistoryAlarm = () => browser.alarms.create("historyAutoDeleteAlarm", {periodInMinutes: 60});


const onSettingsChange = () => {
  let previousSettings = currentSettings;
  currentSettings = store.getState().settings;
  if(currentSettings["keepHistory"].value && previousSettings["keepHistory"].value !== currentSettings["keepHistory"].value) {
    createOldHistoryAlarm();
    deleteOldHistory();
    console.log("Created alarm");
  } else if (!currentSettings["keepHistory"].value && previousSettings["keepHistory"].value !== currentSettings["keepHistory"].value) {
    browser.alarms.clear("historyAutoDeleteAlarm");
    console.log("Deleted alarm");
  }
}

const migration = async() => {
	const oldSettings = await browser.storage.local.get();
	console.log(oldSettings);
	if(Object.keys(oldSettings) !== 0 && oldSettings.migration_1 === undefined && oldSettings.keepHistorySetting !== undefined) {
		store.dispatch(
			updateSetting({payload: {name: "keepHistory", value: oldSettings.keepHistorySetting} })
		);
		store.dispatch(
			updateSetting({payload: {name: "daysToKeep", value: oldSettings.daysToKeep}})
		);
		store.dispatch(
			updateSetting({payload: {name: "statLogging", value: oldSettings.statLoggingSetting}})
		);
		store.dispatch(
			updateSetting({payload: {name: "showVisitsInIcon", value: oldSettings.showVisitsInIconSetting}})
		);
		oldSettings.URLS.forEach((domain) => store.dispatch(addExpression({payload: {expression: `${domain}*`}})));
		browser.storage.local.set({migration_1: true});
	}
}


//Show how many history entries for a domain
const showVisitsInBadge = async (tabURL,tabID) => {
	const results = await browser.history.search({
    	text: getHostname(tabURL),
    	maxResults: 1000000000,
    	startTime: 0
	});
  browser.browserAction.setBadgeText({text: results.length.toString(), tabId: tabID});
  browser.browserAction.setBadgeBackgroundColor({color: "#e68d7d", tabId: tabID});
}

//Logic that controls when to disable the browser action
browser.tabs.onUpdated.addListener( async (tabId, changeInfo, tab) => {
	if (tab.status === "complete") {
		const windowInfo = await browser.windows.getCurrent();
		if (!isAWebpage(tab.url) || windowInfo.incognito) {
			browser.browserAction.disable(tab.id);
			browser.browserAction.setBadgeText({text: "X", tabId: tab.id});
			browser.browserAction.setBadgeBackgroundColor({color: "red", tabId: tab.id});
		} else {
			browser.browserAction.enable(tab.id);
			browser.browserAction.setBadgeText({text: "", tabId: tab.id});

			if(getSetting("showVisitsInIcon")) {
				showVisitsInBadge(tab.url, tab.id);
			}
		}

	}
});


const findMatch = (url, expressionList) => {
  return expressionList.some(expression => {
    // Have to make a new RegExp to avoid mutating the one in the store after test
    const regExpObj = new RegExp(expression.regExp);
    return regExpObj.test(url);
  });
}

//Deletes the history on visit if in the set
browser.history.onVisited.addListener((historyItem) => {
  const currentHostUrl = spliceWWW(historyItem.url);
  if(findMatch(currentHostUrl, store.getState().expressions)) {
		store.dispatch(
			incrementHistoryDeletedCounter()
		);
    return browser.history.deleteUrl({url: historyItem.url});
  }
});
